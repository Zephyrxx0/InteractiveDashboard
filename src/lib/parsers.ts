import mammoth from 'mammoth';
import Papa from 'papaparse';
import * as xlsx from 'xlsx';

/**
 * Parses an XLSX buffer and returns a markdown table representation of its sheets.
 */
export async function parseXLSX(buffer: Buffer): Promise<string> {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetsText: string[] = [];
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // Convert to array of arrays
    const json = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    if (json.length === 0) continue;
    
    // Simple markdown formatting
    sheetsText.push(`## Sheet: ${sheetName}`);
    // Assume first row is header
    const headers = json[0] || [];
    const headerLine = `| ${headers.map(h => String(h).replace(/\|/g, '-')).join(' | ')} |`;
    const separator = `| ${headers.map(() => '---').join(' | ')} |`;
    
    sheetsText.push(headerLine);
    sheetsText.push(separator);
    
    for (let i = 1; i < json.length; i++) {
       const row = json[i];
       const rowStrings = headers.map((_, idx) => String(row[idx] || '').replace(/\|/g, '-'));
       sheetsText.push(`| ${rowStrings.join(' | ')} |`);
    }
  }

  return sheetsText.join('\n');
}

/**
 * Parses a DOCX buffer and returns plain text.
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

/**
 * Parses a CSV buffer and returns its string content.
 */
export async function parseCSV(buffer: Buffer): Promise<string> {
  const csvString = buffer.toString('utf-8');
  // Just parsing it with papaparse to validate or convert to strict format if needed
  // For LLM context, plain text or markdown might suffice. 
  // Let's just return the strict text
  const result = Papa.parse(csvString, { skipEmptyLines: true });
  if (result.errors.length && result.data.length === 0) {
    throw new Error('Failed to parse CSV');
  }
  return Papa.unparse(result.data);
}
