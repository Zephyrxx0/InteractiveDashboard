'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { validateFile } from '@/lib/file-utils';
import { FILE_CONFIG, MAX_SIZE_LABEL } from '@/types/media';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  onError?: (errors: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesAccepted,
  onError,
  multiple = true,
  maxFiles = 10,
  className,
  disabled,
}: FileDropzoneProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Validate each file
    acceptedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        newErrors.push(validation.error!);
      }
    });

    // Handle rejected files (from dropzone's own validation)
    rejectedFiles.forEach(({ file, errors: dropzoneErrors }) => {
      dropzoneErrors.forEach(err => {
        if (err.code === 'file-too-large') {
          newErrors.push(`"${file.name}" exceeds ${MAX_SIZE_LABEL}`);
        } else if (err.code === 'file-invalid-type') {
          newErrors.push(`"${file.name}" has invalid type`);
        }
      });
    });

    setErrors(newErrors);
    if (newErrors.length > 0) {
      onError?.(newErrors);
    }
    if (validFiles.length > 0) {
      onFilesAccepted(validFiles);
    }
  }, [onFilesAccepted, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    maxSize: FILE_CONFIG.maxSize,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    disabled,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-muted-foreground">
            cloud_upload
          </span>
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Max {MAX_SIZE_LABEL} per file • Images & documents only
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-xs text-destructive flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
