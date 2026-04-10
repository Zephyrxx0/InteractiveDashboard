'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useExtraction, useStartExtraction } from '@/hooks/use-extractions';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { createProject } from '@/lib/db/projects';

interface DataImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataImportModal({ open, onOpenChange }: DataImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mediaFileId, setMediaFileId] = useState<string | null>(null);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  
  const startExtraction = useStartExtraction();
  const queryClient = useQueryClient();
  
  const { data: extraction } = useExtraction(extractionId || '');

  // Progress logic
  if (step === 2 && extraction?.status === 'completed') {
    setStep(3);
  } else if (step === 2 && extraction?.status === 'failed') {
    setStep(1);
    setExtractionId(null);
    setMediaFileId(null);
    alert('Extraction failed');
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    
    // Simulate uploading file to get a mediaFileId
    // Because we need a media profile first before extracting
    try {
      const ext = file.name.split('.').pop() || '';
      const path = `imports/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path);

      // Create dummy media record
      const { data: mediaData, error: mediaError } = await supabase.from('media').insert({
        name: file.name,
        type: file.type,
        size: file.size,
        url: publicUrlData.publicUrl,
        storage_path: path
      }).select().single();
      
      if (mediaError) throw mediaError;

      setMediaFileId(mediaData.id);
      
      // Start Extraction
      setStep(2);
      const res = await startExtraction.mutateAsync(mediaData.id);
      setExtractionId(res.extractionId);
      
    } catch (e) {
      console.error(e);
      alert('Failed to upload file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const handleCommit = async () => {
    const extractedData = extraction?.result?.extractedTextPreview || 'Unknown Project';
    try {
      await createProject({
        name: 'Imported Project: ' + extractedData.slice(0, 10),
        description: 'Auto-imported from ' + extractedData.slice(0, 50),
        status: 'planning'
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setStep(4);
    } catch (e) {
      console.error(e);
      alert('Failed to commit project');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (step !== 2) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Project Data</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Upload a CSV, XLSX, or DOCX file to automatically extract project structure.'}
            {step === 2 && 'Processing document with AI...'}
            {step === 3 && 'Review extracted information.'}
            {step === 4 && 'Successfully imported!'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input {...getInputProps()} />
              <p>Drag and drop a file, or click to browse</p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-4 py-8">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                sync
              </span>
              <Progress value={undefined} className="w-[80%]" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/20 whitespace-pre-wrap max-h-64 overflow-y-auto">
                <span className="font-semibold block mb-2">Preview Text:</span>
                {extraction?.result?.extractedTextPreview || 'Could not preview text.'}
              </div>
              <p className="text-sm text-muted-foreground italic">
                (A full ReviewTable component would map fields here in future iterations)
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleCommit}>Commit as Project</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center gap-4 py-8">
              <span className="material-symbols-outlined text-5xl text-green-500">
                check_circle
              </span>
              <p>Project successfully imported.</p>
              <Button onClick={() => { onOpenChange(false); setStep(1); }}>Done</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
