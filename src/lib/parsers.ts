import mammoth from 'mammoth';
import Papa from 'papaparse';
import * as xlsx from 'xlsx';

/**
 * Converts a 2D array (sheet data) to a Markdown table string for LLM readability.
 */
export function sheetToMarkdown(data: any[][]): string {
  if (!data || data.length === 0) return '';
  
  // Find max columns
  const maxCols = Math.max(...data.map(row => row.length));
  
  const rows = data.map(row => {
    // Fill empty cells and sanitize pipes
    const paddedRow = Array.from({ length: maxCols }, (_, i) => {
      const cell = row[i];
      return cell === undefined || cell === null ? '' : String(cell).replace(/\|/g, '\\|');
    });
    return `| ${paddedRow.join(' | ')} |`;
  });

  if (rows.length === 0) return '';

  // Add header separator
  const separator = `| ${Array(maxCols).fill('---').join(' | ')} |`;
  rows.splice(1, 0, separator);

  return rows.join('\n');
}

/**
 * Parses an XLSX buffer and returns a structured object of sheets formatted as Markdown.
 */
export async function parseXLSX(buffer: Buffer): Promise<Record<string, string>> {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const result: Record<string, string> = {};
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    if (data.length > 0) {
      result[sheetName] = sheetToMarkdown(data);
    }
  }

  return result;
}

/**
 * Parses a DOCX buffer and returns cleaned plain text.
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  // We use mammoth to get raw text instead of HTML for easier LLM consumption
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim() || '';
}

/**
 * Parses a CSV buffer and returns its data as a Markdown table.
 */
export async function parseCSV(buffer: Buffer): Promise<string> {
  const csvString = buffer.toString('utf-8');
  const result = Papa.parse(csvString, { skipEmptyLines: true });
  if (result.errors.length && result.data.length === 0) {
    throw new Error('Failed to parse CSV');
  }
  return sheetToMarkdown(result.data as any[][]);
}
