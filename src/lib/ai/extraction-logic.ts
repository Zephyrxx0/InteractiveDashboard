import ollama from '../ollama';
import { ExtractionRecord } from '../extraction-schema';

const SYSTEM_PROMPT = `
You are an expert NGO project data extractor. Your goal is to analyze unstructured documents (XLSX tables, DOCX narratives, or CSV exports) and extract key project metadata into a structured JSON format.

### Extraction Rules:
1. **Ambiguity**: If a field is mentioned multiple times with conflicting information (e.g., two different budgets), use the one marked as "Total" or the most recent calculation.
2. **Project Name**: Look for headers like "Project Title", "Proposal Name", or the first significant title in the document.
3. **Budget**: Extract the numerical amount and the currency code (e.g., USD, EUR, GNF). Preserve the 'raw' string (e.g., "1.5M Euro").
4. **Timeframe**: Look for start/end dates or durations like "12 months". Convert dates to YYYY-MM-DD if possible.
5. **Key Tasks**: Identify 3-5 major milestones or high-level activities.
6. **No Fabrications**: If a piece of information is absolutely missing, return null for that field. Do NOT invent data.
7. **Clean Output**: Output ONLY valid JSON.

### Output Schema:
{
  "projectName": string | null,
  "description": string | null,
  "budget": {
    "amount": number | null,
    "currency": string | null,
    "raw": string | null
  },
  "region": string | null,
  "status": "planning" | "active" | "completed" | "on-hold" | null,
  "timeframe": {
    "start": string | null,
    "end": string | null,
    "duration": string | null
  },
  "keyTasks": string[]
}
`;

/**
 * Calculates a simple confidence score (0-1) based on field presence and content quality.
 */
function calculateConfidence(data: any): number {
  const essentialFields = ['projectName', 'budget', 'keyTasks'];
  let score = 0;
  
  if (data.projectName && data.projectName.length > 5) score += 0.4;
  if (data.budget && data.budget.amount) score += 0.3;
  if (data.keyTasks && data.keyTasks.length > 0) score += 0.3;
  
  return Math.min(score, 1.0);
}

/**
 * Sends parsed document text to Gemma4 for structured extraction.
 */
export async function extractProjectData(text: string): Promise<{ record: Partial<ExtractionRecord['fields']>, confidence: number }> {
  try {
    const response = await ollama.chat({
      model: 'gemma:9b', // or 'gemma4' depending on pull name
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract data from the following document content:\n\n${text.slice(0, 15000)}` }
      ],
      format: 'json',
      options: {
        temperature: 0.1, // Low temperature for deterministic extraction
      }
    });

    const extracted = JSON.parse(response.message.content);
    const confidence = calculateConfidence(extracted);

    return {
      record: extracted,
      confidence
    };
  } catch (error) {
    console.error('AI Extraction Error:', error);
    throw new Error('Failed to extract data via AI');
  }
}
