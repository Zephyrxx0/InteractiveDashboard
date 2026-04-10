import { NextResponse } from 'next/server';
import { getExtractionByMediaId, createExtraction, updateExtractionStatus } from '@/lib/db/extractions';

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
        // Parse & call ollama will be implemented in later waves
        await new Promise(resolve => setTimeout(resolve, 2000));
        await updateExtractionStatus(extraction.id, 'completed', { mocked: true });
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
