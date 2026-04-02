'use client';

import { useState, useCallback } from 'react';
import { uploadFile } from '@/lib/firebase-storage';
import { MediaFile, UploadProgress } from '@/types/media';
import { UploadTask } from 'firebase/storage';

interface UseFileUploadOptions {
  path?: string;
  onUploadComplete?: (file: MediaFile) => void;
  onAllComplete?: (files: MediaFile[]) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [completedFiles, setCompletedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTasks, setUploadTasks] = useState<Map<string, UploadTask>>(new Map());

  const uploadFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newTasks = new Map(uploadTasks);
    let pendingCount = files.length;
    const newCompletedFiles: MediaFile[] = [];

    files.forEach(file => {
      const task = uploadFile(file, {
        path: options.path,
        onProgress: (progress) => {
          setUploads(prev => {
            const existing = prev.findIndex(p => p.fileId === progress.fileId);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = progress;
              return updated;
            }
            return [...prev, progress];
          });
        },
        onComplete: (mediaFile) => {
          newCompletedFiles.push(mediaFile);
          setCompletedFiles(prev => [...prev, mediaFile]);
          options.onUploadComplete?.(mediaFile);
          
          pendingCount--;
          if (pendingCount === 0) {
            setIsUploading(false);
            options.onAllComplete?.(newCompletedFiles);
          }
        },
        onError: (error) => {
          console.error('Upload error:', error);
          pendingCount--;
          if (pendingCount === 0) {
            setIsUploading(false);
          }
        },
      });

      if (task) {
        newTasks.set(file.name, task);
      }
    });

    setUploadTasks(newTasks);
  }, [options, uploadTasks]);

  const cancelUpload = useCallback((fileId: string) => {
    const upload = uploads.find(u => u.fileId === fileId);
    if (upload && upload.status === 'uploading') {
      const task = uploadTasks.get(upload.fileName);
      if (task) {
        task.cancel();
        setUploads(prev => prev.filter(u => u.fileId !== fileId));
      }
    }
  }, [uploads, uploadTasks]);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'complete'));
  }, []);

  const reset = useCallback(() => {
    setUploads([]);
    setCompletedFiles([]);
    setIsUploading(false);
    setUploadTasks(new Map());
  }, []);

  return {
    uploads,
    completedFiles,
    isUploading,
    uploadFiles,
    cancelUpload,
    clearCompleted,
    reset,
  };
}
