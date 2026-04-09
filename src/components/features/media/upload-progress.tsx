'use client';

import { UploadProgress as UploadProgressType } from '@/types/media';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  uploads: UploadProgressType[];
  onCancel?: (fileId: string) => void;
}

export function UploadProgressList({ uploads, onCancel }: UploadProgressProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="space-y-2">
      {uploads.map(upload => (
        <div key={upload.fileId} className="flex items-center gap-3 p-2 border border-border rounded">
          <span className="material-symbols-outlined text-muted-foreground">
            {upload.status === 'complete' ? 'check_circle' : 
             upload.status === 'error' ? 'error' : 'upload_file'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{upload.fileName}</p>
            {upload.status === 'uploading' && (
              <Progress value={upload.progress} className="h-1 mt-1" />
            )}
            {upload.status === 'error' && (
              <p className="text-xs text-destructive">{upload.error}</p>
            )}
          </div>
          {upload.status === 'uploading' && onCancel && (
            <button
              onClick={() => onCancel(upload.fileId)}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
