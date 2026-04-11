import fs from 'fs';
import path from 'path';
import { parseXLSX, parseDOCX, parseCSV } from '../parsers';

async function main() {
  const filePath = path.join(process.cwd(), 'feat_guide/YRA/MPPR Data folder/December 2023.xlsx');
  console.log(`Testing with file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error('Sample file not found!');
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);
  const data = await parseXLSX(buffer);
  
  console.log('--- Extracted Data Preview ---');
  Object.keys(data).forEach(sheet => {
    console.log(`Sheet: ${sheet}, Rows: ${data[sheet].length}`);
  });
  console.log('------------------------------');
  
  if (Object.keys(data).length > 0) {
    console.log('✅ Parser test passed!');
  } else {
    console.error('❌ Parser test failed (empty output)');
  }
}

main().catch(console.error);
