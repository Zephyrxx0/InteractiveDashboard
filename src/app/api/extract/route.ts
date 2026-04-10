import { NextResponse } from 'next/server';
import { getExtractionByMediaId, createExtraction, updateExtractionStatus } from '@/lib/db/extractions';
import { supabase } from '@/lib/supabase';
import { parseXLSX, parseDOCX, parseCSV } from '@/lib/parsers';

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
    
    // Simulate async job
    const processExtraction = async () => {
      try {
        await updateExtractionStatus(extraction.id, 'processing');
        
        // Fetch media details
        const { data: mediaFile, error: mediaError } = await supabase
          .from('media')
          .select('*')
          .eq('id', mediaFileId)
          .single();
          
        if (mediaError || !mediaFile) {
          throw new Error('Media file not found');
        }

        let fileBuffer: Buffer;
        if (mediaFile.storage_path) {
          // Download directly from Supabase JS client
          const { data, error: downloadError } = await supabase.storage
            .from('media')
            .download(mediaFile.storage_path);
          if (downloadError) throw downloadError;
          fileBuffer = Buffer.from(await data.arrayBuffer());
        } else if (mediaFile.url) {
          // Download from URL
          const res = await fetch(mediaFile.url);
          if (!res.ok) throw new Error(`Failed to download file from URL: ${res.statusText}`);
          fileBuffer = Buffer.from(await res.arrayBuffer());
        } else {
           throw new Error('No valid url or storage_path found');
        }

        // Parse file
        let extractedText = '';
        const name = mediaFile.name.toLowerCase();
        
        if (name.endsWith('.xlsx')) {
          extractedText = await parseXLSX(fileBuffer);
        } else if (name.endsWith('.docx')) {
          extractedText = await parseDOCX(fileBuffer);
        } else if (name.endsWith('.csv')) {
          extractedText = await parseCSV(fileBuffer);
        } else {
          // For now, assume plain text for other formats or skip
          extractedText = fileBuffer.toString('utf-8');
        }

        // Call Ollama will be implemented in wave 3 (or 4). Mocking for now.
        // await ollama.chat({...})
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await updateExtractionStatus(extraction.id, 'completed', { 
          mocked: true, 
          extractedTextPreview: extractedText.slice(0, 200) 
        });
      } catch (err) {
        await updateExtractionStatus(extraction.id, 'failed', { error: String(err) });
      }
    };
    
    // Fire and forget
    processExtraction().catch(console.error);

    return NextResponse.json({ message: 'Extraction started', extractionId: extraction.id }, { status: 202 });

  } catch (error) {
    console.error('Extract API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
