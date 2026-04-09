'use client';

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTask } from 'firebase/storage';
import { MediaFile, UploadProgress } from '@/types/media';
import { generateFileId, getFileType } from './file-utils';

let storage: ReturnType<typeof getStorage> | null = null;

function getStorageInstance() {
  if (!storage) {
    try {
      // Dynamic require to avoid circular dependency
      const { app } = require('./firebase');
      if (app) storage = getStorage(app);
    } catch (e) {
      console.warn('Firebase Storage not initialized');
    }
  }
  return storage;
}

interface UploadOptions {
  path?: string; // Storage path prefix
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (file: MediaFile) => void;
  onError?: (error: Error) => void;
}

/**
 * Upload a file to Firebase Storage with progress tracking.
 * Uses XMLHttpRequest under the hood for progress events.
 * 
 * @param file - File to upload
 * @param options - Upload configuration
 * @returns Upload task for cancellation
 */
export function uploadFile(file: File, options: UploadOptions = {}): UploadTask | null {
  const storageInstance = getStorageInstance();
  if (!storageInstance) {
    options.onError?.(new Error('Firebase Storage not configured'));
    return null;
  }

  const fileId = generateFileId();
  const path = options.path || 'uploads';
  const filePath = `${path}/${fileId}_${file.name}`;
  const storageRef = ref(storageInstance, filePath);

  // Initial progress
  options.onProgress?.({
    fileId,
    fileName: file.name,
    progress: 0,
    status: 'uploading',
  });

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      options.onProgress?.({
        fileId,
        fileName: file.name,
        progress: Math.round(progress),
        status: 'uploading',
      });
    },
    (error) => {
      options.onProgress?.({
        fileId,
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: error.message,
      });
      options.onError?.(error);
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const mediaFile: MediaFile = {
          id: fileId,
          name: file.name,
          type: getFileType(file.type),
          mimeType: file.type,
          size: file.size,
          url: downloadURL,
          uploadedAt: new Date(),
        };

        options.onProgress?.({
          fileId,
          fileName: file.name,
          progress: 100,
          status: 'complete',
        });
        options.onComplete?.(mediaFile);
      } catch (error) {
        options.onError?.(error as Error);
      }
    }
  );

  return uploadTask;
}

/**
 * Delete a file from Firebase Storage.
 */
export async function deleteFile(filePath: string): Promise<void> {
  const storageInstance = getStorageInstance();
  if (!storageInstance) throw new Error('Firebase Storage not configured');
  
  const storageRef = ref(storageInstance, filePath);
  await deleteObject(storageRef);
}

/**
 * Get download URL for a file.
 */
export async function getFileDownloadUrl(filePath: string): Promise<string> {
  const storageInstance = getStorageInstance();
  if (!storageInstance) throw new Error('Firebase Storage not configured');
  
  const storageRef = ref(storageInstance, filePath);
  return getDownloadURL(storageRef);
}
