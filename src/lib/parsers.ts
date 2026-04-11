import mammoth from 'mammoth';
import Papa from 'papaparse';
import * as xlsx from 'xlsx';

/**
 * Parses an XLSX buffer and returns a structured object of sheets.
 */
export async function parseXLSX(buffer: Buffer): Promise<Record<string, any[][]>> {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const result: Record<string, any[][]> = {};
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    if (data.length > 0) {
      result[sheetName] = data;
    }
  }

  return result;
}

/**
 * Parses a DOCX buffer and returns HTML.
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.convertToHtml({ buffer });
  return result.value || '';
}

/**
 * Parses a CSV buffer and returns its data as a 2D array.
 */
export async function parseCSV(buffer: Buffer): Promise<any[][]> {
  const csvString = buffer.toString('utf-8');
  const result = Papa.parse(csvString, { skipEmptyLines: true });
  if (result.errors.length && result.data.length === 0) {
    throw new Error('Failed to parse CSV');
  }
  return result.data as any[][];
}
