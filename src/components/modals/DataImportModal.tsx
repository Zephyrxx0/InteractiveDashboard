'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useExtraction, useStartExtraction } from '@/hooks/use-extractions';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { TabbedTableView } from '../data/TabbedTableView';
import { DocumentRenderer } from '../data/DocumentRenderer';

interface DataImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function DataImportModal({ open, onOpenChange, projectId }: DataImportModalProps) {
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
    try {
      if (projectId && mediaFileId) {
        // Import based Project-Documents DB Handler
        const { associateDocumentWithProject } = await import('@/lib/db/project-documents');
        await associateDocumentWithProject(mediaFileId, projectId);
      } else {
        const { createProject } = await import('@/lib/db/projects');
        await createProject({
          name: 'Imported Project: ' + (extraction?.result?.fileName || 'Auto-Imported'),
          description: 'Document reference added to library.',
          status: 'on_track'
        });
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (projectId) queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      setStep(4);
    } catch (e) {
      console.error(e);
      alert('Failed to commit data');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (step !== 2) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Project Data</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Upload a CSV, XLSX, or DOCX file to format and add to your library.'}
            {step === 2 && 'Formatting and preparing high-fidelity preview...'}
            {step === 3 && 'Review the formatted document.'}
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
              <div className="max-h-[60vh] overflow-hidden">
                {extraction?.result?.fileType === 'xlsx' || extraction?.result?.fileType === 'csv' ? (
                   <TabbedTableView 
                     data={extraction.result.fileType === 'csv' 
                       ? { [extraction.result.fileName]: extraction.result.formattedData } 
                       : extraction.result.formattedData
                     } 
                   />
                ) : extraction?.result?.fileType === 'docx' ? (
                   <DocumentRenderer html={extraction.result.formattedData} />
                ) : (
                  <div className="border border-border p-4 bg-muted/20 whitespace-pre-wrap font-mono text-sm h-64 overflow-y-auto">
                    {extraction?.result?.formattedData || 'No data preview available.'}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleCommit}>
                  Import Data
                </Button>
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
