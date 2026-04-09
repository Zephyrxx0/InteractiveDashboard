export interface MediaFile {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number; // bytes
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  projectId?: string;
  taskId?: string;
}

export type FileType = 'image' | 'document' | 'video' | 'other';

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}

// File validation configuration
export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'],
};

// Human-readable size limit
export const MAX_SIZE_LABEL = '10MB';
