import { NextResponse } from 'next/server';
import { getExtractionByMediaId, createExtraction, updateExtractionStatus } from '@/lib/db/extractions';
import { supabase } from '@/lib/supabase';
import { parseXLSX, parseDOCX, parseCSV } from '@/lib/parsers';
import { extractProjectData } from '@/lib/ai/extraction-logic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaFileId } = body;

    if (!mediaFileId) {
      return NextResponse.json({ error: 'Missing mediaFileId' }, { status: 400 });
    }

    let extraction = await getExtractionByMediaId(mediaFileId);
    if (!extraction) {
      extraction = await createExtraction(mediaFileId);
    }
    
    // Process extraction
    const processExtraction = async () => {
      try {
        await updateExtractionStatus(extraction.id, 'parsing');
        
        const { data: mediaFile, error: mediaError } = await supabase
          .from('media_files')
          .select('*')
          .eq('id', mediaFileId)
          .single();
          
        if (mediaError || !mediaFile) {
          throw new Error('Media file not found');
        }

        let fileBuffer: Buffer;
        if (mediaFile.storage_path) {
          const { data, error: downloadError } = await supabase.storage
            .from('media')
            .download(mediaFile.storage_path);
          if (downloadError) throw downloadError;
          fileBuffer = Buffer.from(await data.arrayBuffer());
        } else if (mediaFile.url) {
          const res = await fetch(mediaFile.url);
          if (!res.ok) throw new Error(`Failed to download file: ${res.statusText}`);
          fileBuffer = Buffer.from(await res.arrayBuffer());
        } else {
           throw new Error('No valid URL or storage_path found');
        }

        const name = mediaFile.name.toLowerCase();
        let rawContent: string = '';
        let type: 'xlsx' | 'docx' | 'csv' | 'text' = 'text';

        if (name.endsWith('.xlsx')) {
          const sheets = await parseXLSX(fileBuffer);
          rawContent = Object.entries(sheets).map(([s, content]) => `Sheet: ${s}\n${content}`).join('\n\n');
          type = 'xlsx';
        } else if (name.endsWith('.docx')) {
          rawContent = await parseDOCX(fileBuffer);
          type = 'docx';
        } else if (name.endsWith('.csv')) {
          rawContent = await parseCSV(fileBuffer);
          type = 'csv';
        } else {
          rawContent = fileBuffer.toString('utf-8');
          type = 'text';
        }

        // STEP 2: AI Extraction Logic
        await updateExtractionStatus(extraction.id, 'extracting');
        
        try {
          const { record, confidence } = await extractProjectData(rawContent);
          
          await updateExtractionStatus(extraction.id, 'completed', { 
            formattedData: record,
            confidence: confidence,
            fileType: type,
            fileName: mediaFile.name,
            rawPreview: rawContent.slice(0, 1000) // Keep a short preview for fallback
          });
        } catch (aiError) {
          console.error('AI Extraction failed, falling back to raw preview:', aiError);
          // Fallback to purely deterministic output if AI fails
          await updateExtractionStatus(extraction.id, 'completed', { 
            formattedData: { projectName: mediaFile.name },
            fileType: type,
            fileName: mediaFile.name,
            rawPreview: rawContent,
            error: 'AI extraction failed, previewing raw content instead'
          });
        }
      } catch (err) {
        console.error('Processing error:', err);
        await updateExtractionStatus(extraction.id, 'failed', { error: String(err) });
      }
    };
    
    // Process in background
    processExtraction().catch(console.error);

    return NextResponse.json({ message: 'Extraction started', extractionId: extraction.id }, { status: 202 });

  } catch (error) {
    console.error('Extract API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
