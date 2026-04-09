'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MediaFile } from '@/types/media';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageThumbnailProps {
  file: MediaFile;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const SIZES = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
};

export function ImageThumbnail({ file, size = 'md', onClick, className }: ImageThumbnailProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (file.type !== 'image') {
    return (
      <div className={cn(SIZES[size], "bg-muted flex items-center justify-center rounded", className)}>
        <span className="material-symbols-outlined text-muted-foreground">
          {file.type === 'document' ? 'description' : 'insert_drive_file'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        SIZES[size],
        "relative rounded overflow-hidden bg-muted",
        onClick && "cursor-pointer hover:opacity-90",
        className
      )}
      onClick={onClick}
    >
      {!loaded && !error && <Skeleton className="absolute inset-0" />}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-muted-foreground">broken_image</span>
        </div>
      ) : (
        <img
          src={file.thumbnailUrl || file.url}
          alt={file.name}
          className={cn(
            "w-full h-full object-cover transition-opacity",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
