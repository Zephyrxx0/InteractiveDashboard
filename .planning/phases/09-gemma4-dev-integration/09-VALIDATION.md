# Phase 09: Gemma4 Dev Integration - Validation

**Created:** 2026-04-10
**Status:** Defined

## 1. Unit Testing (Deterministic)
Verify that the underlying file parsers work correctly without AI.

- **Acceptance Criteria:**
  - `parsers.test.ts`: Extracts text from a sample `.docx`.
  - `parsers.test.ts`: Extracts headers and rows from a sample `.xlsx`.
  - `parsers.test.ts`: Parses CSV content into JSON objects.

## 2. Integration Testing (Ollama Bridge)
Verify the connection to the local Ollama instance.

- **Acceptance Criteria:**
  - `ollama.test.ts`: Mocked response verification (ensures prompt formatting logic).
  - Manual verification of `ollama ping` from the API route.

## 3. Extraction Accuracy (Qualitative)
Evaluate the LLM's performance on project-specific data.

- **Acceptance Criteria:**
  - Given a sample Docx with a clear project name and date, Gemma 4 identifies them within 90% accuracy.
  - JSON output always adheres to the target schema.
  - Confidence scores are returned for all primary fields.

## 4. State Machine Validation (Supabase)
Verify the async job flow.

- **Acceptance Criteria:**
  - Uploading a file creates a `pending` extraction record.
  - Starting processing moves status to `processing`.
  - Failure (e.g., model not found) moves status to `failed` and records the error.
  - Success moves status to `completed` and stores valid JSONB.

## 5. UI/UX Verification
Verify the end-to-end user flow.

- **Acceptance Criteria:**
  - Progress bar reflects real-time status from Supabase.
  - Review table allows manual correction of extracted data.
  - "Commit" action correctly creates a project in the `projects` table.

---

*Phase: 09-gemma4-dev-integration*
*Validation defined: 2026-04-10*
