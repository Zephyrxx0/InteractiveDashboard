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
    
    // Process extraction
    const processExtraction = async () => {
      try {
        await updateExtractionStatus(extraction.id, 'processing');
        
        // Fetch media details from 'media' bucket metadata (sync via DB)
        // Note: media table is used here, assuming it's the source of truth for files
        const { data: mediaFile, error: mediaError } = await supabase
          .from('media_files') // Using media_files table from current schema
          .select('*')
          .eq('id', mediaFileId)
          .single();
          
        if (mediaError || !mediaFile) {
          throw new Error('Media file not found');
        }

        let fileBuffer: Buffer;
        if (mediaFile.storage_path) {
          const { data, error: downloadError } = await supabase.storage
            .from('media') // bucket name
            .download(mediaFile.storage_path);
          if (downloadError) throw downloadError;
          fileBuffer = Buffer.from(await data.arrayBuffer());
        } else if (mediaFile.url) {
          const res = await fetch(mediaFile.url);
          if (!res.ok) throw new Error(`Failed to download file from URL: ${res.statusText}`);
          fileBuffer = Buffer.from(await res.arrayBuffer());
        } else {
           throw new Error('No valid url or storage_path found');
        }

        const name = mediaFile.name.toLowerCase();
        let resultData: any = null;
        let type: 'xlsx' | 'docx' | 'csv' | 'text' = 'text';

        if (name.endsWith('.xlsx')) {
          resultData = await parseXLSX(fileBuffer);
          type = 'xlsx';
        } else if (name.endsWith('.docx')) {
          resultData = await parseDOCX(fileBuffer);
          type = 'docx';
        } else if (name.endsWith('.csv')) {
          resultData = await parseCSV(fileBuffer);
          type = 'csv';
        } else {
          resultData = fileBuffer.toString('utf-8');
          type = 'text';
        }

        // Store formatted result instead of AI extraction
        await updateExtractionStatus(extraction.id, 'completed', { 
          formattedData: resultData,
          fileType: type,
          fileName: mediaFile.name
        });
      } catch (err) {
        console.error('Processing error:', err);
        await updateExtractionStatus(extraction.id, 'failed', { error: String(err) });
      }
    };
    
    // Process in background for large files, though we return early
    processExtraction().catch(console.error);

    return NextResponse.json({ message: 'Formatting started', extractionId: extraction.id }, { status: 202 });

  } catch (error) {
    console.error('Extract API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
