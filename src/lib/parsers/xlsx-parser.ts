const XLSX: any = typeof require !== 'undefined' ? require('xlsx') : null;

export function parseXLSX(buffer: ArrayBuffer) {
  const workbook = XLSX ? XLSX.read(buffer, { type: 'array' }) : { SheetNames: [], Sheets: {} };
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX && XLSX.utils ? XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) : [];

  // detect header row: first row with only strings
  const header = json[0] as any[];
  const rows = (json.slice(1) as any[][]).map((r) => {
    const obj: Record<string, any> = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i] || `col_${i}`;
      obj[String(key)] = r[i] ?? null;
    }
    return obj;
  });

  return { header, rows, raw: json };
}

export type ParsedSpreadsheet = ReturnType<typeof parseXLSX>;
