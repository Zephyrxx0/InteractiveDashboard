"use client";
import React, { useState } from 'react';
import { ExtractionRecord, ConfidenceLevel } from '@/lib/extraction-schema';

export function ExtractionReviewTable({ records, onChange }: { records: ExtractionRecord[]; onChange?: (r: ExtractionRecord[]) => void }) {
  const [local, setLocal] = useState(records || []);

  function updateRecord(idx: number, key: string, value: any) {
    const copy = [...local];
    copy[idx] = { ...copy[idx], fields: { ...copy[idx].fields, [key]: value } };
    setLocal(copy);
    onChange?.(copy);
  }

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {local.map((rec, idx) => (
          Object.keys(rec.fields).map((key) => (
            <tr key={`${rec.id}-${key}`}> 
              <td className="p-2 align-top">{key}</td>
              <td className="p-2">
                <input className="w-full" value={String(rec.fields[key] ?? '')} onChange={(e) => updateRecord(idx, key, e.target.value)} />
              </td>
              <td className="p-2">{(rec.confidences && rec.confidences[key]) ? Math.round((rec.confidences[key]||0)*100) + '%' : '—'}</td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  );
}

export default ExtractionReviewTable;
