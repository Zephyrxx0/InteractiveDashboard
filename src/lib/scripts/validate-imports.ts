import fs from 'fs';
import path from 'path';
import { parseXLSX, parseDOCX, parseCSV } from '../parsers';

async function main() {
  const samples = [
    { name: 'XLSX (Table)', path: 'feat_guide/YRA/MPPR Data folder/December 2023.xlsx', parser: parseXLSX },
    { name: 'DOCX (Narrative)', path: 'feat_guide/unstructered_docs.docx', parser: parseDOCX },
  ];

  for (const sample of samples) {
    const fullPath = path.join(process.cwd(), sample.path);
    console.log(`\nTesting ${sample.name} with: ${sample.path}`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Sample file not found: ${fullPath}`);
      continue;
    }

    const buffer = fs.readFileSync(fullPath);
    const result = await (sample.parser as any)(buffer);
    
    console.log('--- Extracted Content Preview ---');
    if (typeof result === 'string') {
        console.log(result.slice(0, 500) + '...');
    } else {
        Object.keys(result).forEach(k => console.log(`Sheet: ${k}\n${result[k].slice(0, 300)}...`));
    }
    console.log('---------------------------------');
    console.log(`✅ ${sample.name} parse success!`);
  }
}

main().catch(console.error);
