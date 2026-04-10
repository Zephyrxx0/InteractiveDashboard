"use client";
import React, { useState } from 'react';
import { extractFile, pollExtractionStatus, cancelExtraction } from '@/lib/extraction-api';
import ExtractionProgress from './extraction-progress';
import ExtractionReviewTable from './extraction-review-table';

export function ExtractionModal({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>('idle');

  async function start() {
    if (!file) return;
    setStatus('queued');
    const resp = await extractFile(projectId, file, file.name.split('.').pop() || 'unknown');
    setJobId(resp.jobId);
    setStatus('parsing');
    try {
      const res = await pollExtractionStatus(resp.jobId);
      setResult(res);
      setStatus('complete');
    } catch (err: any) {
      setStatus('error');
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Extract with Gemma</h3>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="mt-2">
        <button className="btn btn-primary" onClick={start} disabled={!file}>Extract</button>
      </div>
      {jobId && <ExtractionProgress status={status} percent={result?.progress || 0} onCancel={() => { if (jobId) cancelExtraction(jobId); }} />}
      {result && <ExtractionReviewTable records={result.records || []} />}
    </div>
  );
}

export default ExtractionModal;
