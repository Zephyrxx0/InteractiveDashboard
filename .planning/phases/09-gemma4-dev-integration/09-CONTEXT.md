# Phase 09: Gemma4 Dev Integration - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Source:** PRD Express Path (feat_guide/gemma4-plan.md)

<domain>
## Phase Boundary

This phase enables AI-powered extraction and comparison of NGO project data from uploaded files (DOCX, CSV, XLSX). It implements a local processing pipeline using Next.js and Ollama (Gemma 4).

</domain>

<decisions>
## Implementation Decisions

### Model & Platform
- Use **Ollama** as the local inference engine.
- Model: `gemma4:9b` for dev version.
- Endpoint: `http://localhost:11434/api/generate` with `format: 'json'`.

### File Processing
- **Deterministic Parsing:** Parse files to plain text/markdown first using dedicated libraries.
  - XLSX: `xlsx`
  - DOCX: `mammoth`
  - CSV: `papaparse`
- **Normalization:** Use LLM to normalize extracted fields into a canonical JSON schema.

### Data Layer
- Store extraction results in the `extractions` table in **Supabase** (switching from Firestore for consistency with Phase 08).
- Table schema: `id`, `media_file_id`, `result (JSONB)`, `status`, `created_at`, `updated_at`.

### User Interface
- Reusable `DataImportModal` derived from `FileDropzone`.
- Multi-step flow: Upload -> Processing -> Review -> Commit.

### the agent's Discretion
- Implementation of polling vs. real-time status updates (using Supabase hooks).
- Specific prompt templates for project data normalization.
- Handling of multiple projects/rows within a single file.

</decisions>

<canonical_refs>
## Canonical References

### Data Selection
- `feat_guide/gemma4-plan.md` — Original integration guide
- `sql/schema.sql` — Database definitions (extractions table)
- `src/lib/db/tasks.ts` — Pattern for data hooks

</canonical_refs>

<specifics>
## Specific Ideas
- Normalize project fields: "Project Name", "Description", "Due Date", "Priority", "Assignees".
- Add confidence scores to each extracted field for UI indicators.

</specifics>

<deferred>
## Deferred Ideas
- Comparison of projects (Use Case 2 in PRD) moved to follow-up phase.
- Generating insights (Use Case 3 in PRD) moved to follow-up phase.

</deferred>

---

*Phase: 09-gemma4-dev-integration*
*Context gathered: 2026-04-10 via PRD Express Path*
