# Phase 09: Gemma4 Dev Integration - Research

## Objective
Identify how to implement local LLM-powered extraction from XLSX, DOCX, and CSV files using Ollama (Gemma 4) while maintaining compatibility with the existing Supabase architecture.

## 1. Ollama Integration
Ollama runs locally as a daemon and exposes a REST API on port `11434`.

### API Signature
- **Endpoint:** `POST /api/generate`
- **Payload:**
  ```json
  {
    "model": "gemma4:9b",
    "prompt": "...",
    "format": "json",
    "stream": false
  }
  ```
- **Response Handling:**
  The API returns a JSON object. The model's actual content is in the `response` field as a string (which must be `JSON.parse`ed).

### Implementation Choice
- Use `node-fetch` (already in `package.json`) or native `fetch` to call `http://localhost:11434`.
- Create a `src/lib/ollama.ts` client wrapper.

## 2. File Parsing Strategy
Next.js API routes run in a Node.js environment. We will use well-tested libraries for deterministic extraction.

### CSV Extraction
- **Library:** `papaparse` or native JS.
- **Approach:** Standard tabular parsing.

### XLSX Extraction
- **Library:** `xlsx` (SheetJS).
- **Approach:** Iterate through sheets, convert to JSON/Markdown for LLM processing.

### DOCX Extraction
- **Library:** `mammoth`.
- **Approach:** Extract raw text. Mammoth is preferred over `docx-parser` because it handles complex paragraph structures well.

## 3. Asynchronous Extraction Workflow
Since the LLM generation can take 30-90 seconds, we cannot block the HTTP request.

### Job Tracking
- Use the `extractions` table in Supabase.
- **Flow:**
  1. API receives request -> sets status to `processing`.
  2. Returns `202 Accepted` with `extraction_id`.
  3. API continues processing in `event.waitUntil` (if Vercel) or just `Promise` (if local dev).
  4. Once complete, updates Supabase with result and status `completed`.

## 4. Prompt Engineering for Gemma 4
Gemma 4 (9b/27b) is very capable but requires structured guidance for consistent JSON.

### Prompt Template
```
System: You are an expert data analyst. Extract project details from the following text and return ONLY a single JSON object.
Schema:
{
  "project_name": "string",
  "description": "string",
  "priority": "low | medium | high | urgent",
  "due_date": "YYYY-MM-DD",
  "confidence": 0-1
}
Text: {extracted_text}
```

## 5. UI Implementation
- Reuse `FileDropzone` from Phase 03.
- New `DataImportModal` using Shadcn/Radix.
- Polling mechanism using `React Query` (refetchInterval) to check extraction status.

## 6. Validation Architecture
- **Dimension 8 (Correctness):** Compare AI-extracted output against deterministic parser results for baseline fields (e.g., matching common headers).
- **Confidence Gates:** If `confidence < 0.7`, flag for mandatory manual review.

---

*Phase: 09-gemma4-dev-integration*
*Research date: 2026-04-10*
