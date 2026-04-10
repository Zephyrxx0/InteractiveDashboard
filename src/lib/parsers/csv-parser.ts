const csvParseSync: any = typeof require !== 'undefined' ? require('csv-parse/sync') : null;

export function parseCSV(text: string, options: any = {}) {
  const records = csvParseSync ? csvParseSync.parse(text, { columns: false, skip_empty_lines: true, ...options }) : [];
  const header = records[0] || [];
  const rows = (records.slice(1) || []).map((r: any[]) => {
    const obj: Record<string, any> = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i] || `col_${i}`;
      obj[String(key)] = r[i] ?? null;
    }
    return obj;
  });
  return { header, rows, raw: records };
}

export type ParsedCSV = ReturnType<typeof parseCSV>;
