'use client';

import { MediaFile } from '@/types/media';
import { formatFileSize } from '@/lib/file-utils';
import { Button } from '@/components/ui/button';
import { ImageThumbnail } from './image-thumbnail';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: MediaFile;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function FilePreview({ file, onDownload, onDelete, className }: FilePreviewProps) {
  const handleDownload = () => {
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.();
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 border border-border rounded-lg", className)}>
      <ImageThumbnail file={file} size="md" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} • {file.type}
        </p>
      </div>

      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <span className="material-symbols-outlined text-sm">download</span>
        </Button>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <span className="material-symbols-outlined text-sm">delete</span>
          </Button>
        )}
      </div>
    </div>
  );
}
