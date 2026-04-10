import { ExtractionEnvelope } from './extraction-schema';

const DEFAULT_URL = typeof process !== 'undefined' && process.env?.GEMMA_API_URL ? process.env.GEMMA_API_URL : 'http://localhost:11434';

function timeoutFetch(input: RequestInfo, init: RequestInit = {}, ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(input, { signal: controller.signal, ...init }).finally(() => clearTimeout(id));
}

async function extractFile(projectId: string, file: File | Blob, format: string) {
  const url = `${DEFAULT_URL}/extract`;
  const form = new FormData();
  form.append('projectId', projectId);
  form.append('file', file as Blob, (file as any).name || 'upload');
  form.append('format', format);

  const res = await timeoutFetch(url, { method: 'POST', body: form }, 20000);
  if (!res.ok) throw new Error(`extractFile failed: ${res.status} ${res.statusText}`);
  const body = await res.json();
  // Expect { jobId }
  return body as { jobId: string };
}

async function pollExtractionStatus(jobId: string, interval = 1500, timeout = 5 * 60 * 1000) : Promise<ExtractionEnvelope> {
  const start = Date.now();
  while (true) {
    const res = await timeoutFetch(`${DEFAULT_URL}/jobs/${jobId}`, {}, 10000);
    if (!res.ok) throw new Error(`pollExtractionStatus: ${res.status}`);
    const body = await res.json();
    if (body.status === 'completed') return body.result as ExtractionEnvelope;
    if (body.status === 'error') throw new Error(body.error || 'Extraction error');
    if (Date.now() - start > timeout) throw new Error('pollExtractionStatus: timeout');
    await new Promise((r) => setTimeout(r, interval));
  }
}

async function cancelExtraction(jobId: string) {
  const res = await timeoutFetch(`${DEFAULT_URL}/jobs/${jobId}/cancel`, { method: 'POST' }, 5000);
  if (!res.ok) throw new Error('cancelExtraction failed');
  return res.json();
}

export { extractFile, pollExtractionStatus, cancelExtraction };
