// Minimal DOCX text extractor using docx-preview or simple zip/xml parsing
const JSZip: any = typeof require !== 'undefined' ? require('jszip') : null;

export async function extractDOCXText(buffer: ArrayBuffer) {
  const zip = JSZip ? await JSZip.loadAsync(buffer) : null;
  const documentXml = zip ? await zip.file('word/document.xml')?.async('string') : null;
  if (!documentXml) return { text: '' };

  // strip XML tags to get text content (simple fallback)
  const text = documentXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return { text, raw: documentXml };
}

export type DOCXContent = ReturnType<typeof extractDOCXText>;
