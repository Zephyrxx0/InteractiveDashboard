import { format } from 'date-fns';

/**
 * Trigger browser file download with the given content.
 */
export function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Format date for export display.
 */
export function formatExportDate(date: Date | null | undefined): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format date for filename (no special chars).
 */
function formatFilenameDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Generate export filename with date.
 */
export function generateFilename(prefix: string, extension: string): string {
  const date = formatFilenameDate(new Date());
  return `${prefix}_${date}.${extension}`;
}

/**
 * Escape CSV cell value (handle quotes and commas).
 */
export function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, newline, or quote, wrap in quotes and escape existing quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
