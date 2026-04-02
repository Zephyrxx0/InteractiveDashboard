'use client';

import { useState, useMemo } from 'react';
import { MediaFile, FileType } from '@/types/media';
import { ImageThumbnail } from './image-thumbnail';
import { formatFileSize } from '@/lib/file-utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaLibraryProps {
  files: MediaFile[];
  onFileSelect?: (file: MediaFile) => void;
  onFileDelete?: (file: MediaFile) => void;
  onFileDownload?: (file: MediaFile) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function MediaLibrary({
  files,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  viewMode = 'grid',
  className,
}: MediaLibraryProps) {
  const [filter, setFilter] = useState<FileType | 'all'>('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    if (filter === 'all') return files;
    return files.filter(f => f.type === filter);
  }, [files, filter]);

  const handleFileClick = (file: MediaFile) => {
    setSelectedFile(file);
    if (file.type === 'image') {
      setPreviewOpen(true);
    } else {
      onFileSelect?.(file);
    }
  };

  const handleDownload = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onFileDownload?.(file);
  };

  return (
    <div className={className}>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono text-muted-foreground uppercase">Filter:</span>
        {(['all', 'image', 'document'] as const).map(type => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(type)}
            className="font-mono text-xs uppercase"
          >
            {type}
          </Button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredFiles.length} files
        </span>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <div className="aspect-square">
                <ImageThumbnail file={file} size="lg" className="w-full h-full" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 bg-background/80 rounded hover:bg-background"
                  onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                  aria-label="Download file"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
                {onFileDelete && (
                  <button
                    className="p-1 bg-background/80 rounded hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => { e.stopPropagation(); onFileDelete(file); }}
                    aria-label="Delete file"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="relative">
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
                <Button onClick={() => handleDownload(selectedFile)}>
                  <span className="material-symbols-outlined mr-2">download</span>
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-muted-foreground">folder_open</span>
          <p className="mt-2 text-muted-foreground">No files found</p>
        </div>
      )}
    </div>
  );
}
