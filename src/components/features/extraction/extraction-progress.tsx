"use client";
import React from 'react';

export type JobStatus = 'queued' | 'parsing' | 'extracting' | 'enriching' | 'complete' | 'error';

export function ExtractionProgress({ status, percent = 0, onCancel }: { status: JobStatus; percent?: number; onCancel?: () => void }) {
  return (
    <div className="p-4">
      <div className="text-sm font-medium">Status: {status}</div>
      <div className="w-full bg-gray-200 rounded h-2 mt-2">
        <div className="bg-blue-500 h-2 rounded" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-2 flex gap-2">
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

export default ExtractionProgress;
