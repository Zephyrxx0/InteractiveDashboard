"use client";
import React from "react";
import ExtractionModal from "@/components/features/extraction/extraction-modal";

export default function DevExtractPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dev: Extraction Modal</h1>
      <p className="mb-4">Quick test page for the Gemma extraction modal. ProjectId used is <code>demo-project</code>.</p>
      <ExtractionModal projectId="demo-project" />
    </main>
  );
}
