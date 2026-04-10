// Simple smoke test script to POST a sample CSV to the local Gemma API and poll for result.
// Usage: node scripts/run-smoke-extraction.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const GEMMA = process.env.GEMMA_API_URL || 'http://localhost:11434';
const SAMPLE = path.resolve(__dirname, '..', 'feat_guide', 'sample.csv');

async function main() {
  if (!fs.existsSync(SAMPLE)) {
    console.error('Sample file not found:', SAMPLE);
    process.exit(1);
  }
  const form = new (require('form-data'))();
  form.append('projectId', 'demo');
  form.append('file', fs.createReadStream(SAMPLE));

  console.log('POST', `${GEMMA}/extract`);
  const res = await fetch(`${GEMMA}/extract`, { method: 'POST', body: form });
  if (!res.ok) {
    console.error('extract failed', res.status, await res.text());
    process.exit(2);
  }
  const body = await res.json();
  const jobId = body.jobId;
  console.log('jobId:', jobId);

  // poll
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const s = await fetch(`${GEMMA}/jobs/${jobId}`);
    if (!s.ok) { console.error('status fetch failed', s.status); continue; }
    const b = await s.json();
    console.log('status:', b.status);
    if (b.status === 'completed') { console.log('result:', JSON.stringify(b.result, null, 2)); process.exit(0); }
    if (b.status === 'error') { console.error('error:', b.error); process.exit(3); }
  }
  console.error('timeout waiting for job');
  process.exit(4);
}

main().catch((err) => { console.error(err); process.exit(99); });
