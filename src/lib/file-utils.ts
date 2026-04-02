import { FileType, FileValidation, FILE_CONFIG } from '@/types/media';

/**
 * Validates a file against size and type restrictions.
 * Returns validation result with error message if invalid.
 */
export function validateFile(file: File): FileValidation {
  // Check size
  if (file.size > FILE_CONFIG.maxSize) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of ${formatFileSize(FILE_CONFIG.maxSize)}`,
    };
  }

  // Check type
  const allowedMimes = [
    ...FILE_CONFIG.allowedTypes.image,
    ...FILE_CONFIG.allowedTypes.document,
  ];
  
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Accepted: images (jpg, png, gif, webp) and documents (pdf, doc, docx)`,
    };
  }

  return { valid: true };
}

/**
 * Determines the file type category from MIME type.
 */
export function getFileType(mimeType: string): FileType {
  if (FILE_CONFIG.allowedTypes.image.includes(mimeType)) return 'image';
  if (FILE_CONFIG.allowedTypes.document.includes(mimeType)) return 'document';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
}

/**
 * Formats bytes into human-readable size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates a unique file ID for tracking.
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets file extension from filename.
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}
