'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { FileDropzone, UploadProgressList, MediaLibrary } from '@/components/features/media';
import { useFileUpload } from '@/hooks/use-file-upload';
import { MediaFile } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data - replace with Firebase data
const MOCK_FILES: MediaFile[] = [
  {
    id: '1',
    name: 'project-screenshot.png',
    type: 'image',
    mimeType: 'image/png',
    size: 245000,
    url: 'https://picsum.photos/800/600?random=1',
    thumbnailUrl: 'https://picsum.photos/200/200?random=1',
    uploadedAt: new Date('2026-03-20'),
  },
  {
    id: '2',
    name: 'requirements.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 1024000,
    url: '#',
    uploadedAt: new Date('2026-03-21'),
  },
  {
    id: '3',
    name: 'wireframe.png',
    type: 'image',
    mimeType: 'image/png',
    size: 180000,
    url: 'https://picsum.photos/800/600?random=2',
    thumbnailUrl: 'https://picsum.photos/200/200?random=2',
    uploadedAt: new Date('2026-03-22'),
  },
  {
    id: '4',
    name: 'mockup-v2.png',
    type: 'image',
    mimeType: 'image/png',
    size: 320000,
    url: 'https://picsum.photos/800/600?random=3',
    thumbnailUrl: 'https://picsum.photos/200/200?random=3',
    uploadedAt: new Date('2026-03-23'),
  },
  {
    id: '5',
    name: 'technical-spec.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 2048000,
    url: '#',
    uploadedAt: new Date('2026-03-24'),
  },
  {
    id: '6',
    name: 'design-system.png',
    type: 'image',
    mimeType: 'image/png',
    size: 156000,
    url: 'https://picsum.photos/800/600?random=4',
    thumbnailUrl: 'https://picsum.photos/200/200?random=4',
    uploadedAt: new Date('2026-03-25'),
  },
];

export default function MediaPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [files, setFiles] = useState<MediaFile[]>(MOCK_FILES);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { uploads, isUploading, uploadFiles, cancelUpload, clearCompleted } = useFileUpload({
    path: `projects/${projectId}/media`,
    onUploadComplete: (file) => {
      setFiles(prev => [file, ...prev]);
    },
    onAllComplete: () => {
      clearCompleted();
      setUploadDialogOpen(false);
    },
  });

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
  };

  const handleFileDelete = async (file: MediaFile) => {
    // In production: Delete from Firebase Storage
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Media Library"
        subtitle={`${files.length} files • Project assets and attachments`}
        actions={
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono text-xs uppercase">
                <span className="material-symbols-outlined text-[16px] mr-2">upload</span>
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <FileDropzone
                  onFilesAccepted={handleFilesAccepted}
                  disabled={isUploading}
                />
                {uploads.length > 0 && (
                  <UploadProgressList
                    uploads={uploads}
                    onCancel={cancelUpload}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex-1 p-6 grid-bg overflow-auto">
        <div className="max-w-[1400px] mx-auto">
          <MediaLibrary
            files={files}
            onFileDelete={handleFileDelete}
          />
        </div>
      </div>
    </div>
  );
}
