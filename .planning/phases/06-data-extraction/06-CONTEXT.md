# Phase 06: data extraction - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can import project files, send them through a local Docker-hosted Gemma4 extraction service, review the extracted output, and present the result in a systematic structured format. This phase covers ingestion, normalization, review, and project-level presentation of extracted data. It does not add unrelated AI capabilities outside project file extraction.

</domain>

<decisions>
## Implementation Decisions

### Service topology
- **D-01:** The Next.js app will call a separate local API service that fronts the Docker-hosted Gemma4 model.
- **D-02:** The model service is local-only; there is no cloud fallback in this phase.

### Extraction output schema
- **D-03:** Primary extraction output is a structured JSON envelope plus extracted row records.
- **D-04:** Schema normalization uses a hybrid model: one canonical core schema plus source-specific extension fields where needed.

### File handling
- **D-05:** Initial supported formats are XLSX, DOCX, and CSV.
- **D-06:** For XLSX files, deterministic parsing happens first and Gemma4 is used to enrich, map, and normalize the parsed data.
- **D-07:** For DOCX files, deterministic text extraction happens first and Gemma4 converts that text into the normalized schema.

### Project UI flow
- **D-08:** Data extraction starts from each project's existing import flow rather than a global standalone page.
- **D-09:** The existing import/mapping pattern in `src/components/data-import-modal.tsx` should be reused or evolved for this phase.
- **D-10:** After extraction, users review results in an editable table with field mappings, confidence indicators, and manual corrections before saving or exporting.

### Access & privacy
- **D-11:** Only authenticated project members can run extraction for that project's imported files.
- **D-12:** Files and extracted content must remain local to the machine or network hosting the Docker model service.

### Runtime & review behavior
- **D-13:** Extraction runs as an async job with progress feedback instead of a fully synchronous request.
- **D-14:** Low-confidence or partially failed extraction keeps partial results and flags uncertain fields or rows for manual review.
- **D-15:** Full extraction failure shows an error, supports retry, and exposes a deterministic raw-parse preview when available.

### Agent's Discretion
- Exact canonical core field names and JSON envelope property names
- Progress polling vs push update mechanism between the app and the local extraction service
- Exact confidence threshold values for warning/flagging rows and fields
- Final visual treatment of the editable review table and progress states

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project planning context
- `.planning/PROJECT.md` — project constraints, stack, and no-backend baseline
- `.planning/REQUIREMENTS.md` — current product requirements baseline that this new phase extends beyond Phase 04
- `.planning/STATE.md` — current completed-phase state before adding Phase 06
- `.planning/ROADMAP.md` — existing roadmap baseline showing that this is a new post-Phase-04 capability
- `.planning/phases/04-reports-export/04-CONTEXT.md` — current structured presentation/export decisions that this phase should align with downstream

### Feature reference docs and sample inputs
- `feat_guide/unstructered_docs.docx` — reference document for the unstructured-document extraction path
- `feat_guide/YRA/MPPR Data folder/December 2023.xlsx` — sample spreadsheet input for schema and parser validation
- `feat_guide/YRA/MPPR Data folder/February 2024.xlsx` — required spreadsheet sample input for schema and parser validation

### Existing code references
- `src/components/data-import-modal.tsx` — current import and field-mapping UI pattern to reuse/evolve
- `src/app/(dashboard)/reports/page.tsx` — current systematic results/export presentation pattern to align with
- `src/lib/export-csv.ts` — existing structured export utility pattern relevant to normalized extraction output

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/data-import-modal.tsx`: Existing import + mapping UI pattern that can anchor the project-level extraction flow.
- `src/app/(dashboard)/reports/page.tsx`: Existing page that already presents structured outputs and export actions in a dashboard-friendly format.
- `src/lib/export-csv.ts`: Existing utility pattern for converting normalized records into structured export output.
- `src/components/ui/*`: Existing dialog, button, card, table-adjacent UI primitives from the dashboard design system.

### Established Patterns
- The app currently has no dedicated backend service layer; major infrastructure is still client-heavy Next.js with Firebase auth.
- Existing dashboard features favor dialog-based flows, typed data models, and separate utility modules for data transformation/export.
- The current codebase already uses project-scoped dashboard surfaces rather than global tools for most workflows.

### Integration Points
- Phase 06 should attach to each project's import workflow and save/review path.
- Auth checks should align with existing Firebase-authenticated project access patterns.
- Normalized extraction output should be shaped so it can later feed the same style of structured presentation/export patterns used in reports.

</code_context>

<specifics>
## Specific Ideas

- The user's local Gemma4 model is self-hosted through Docker and should stay behind a separate local API service.
- “Systematic format” means structured JSON plus rows, not a loose narrative-only response.
- Spreadsheets should not be treated as pure LLM input; deterministic parsing comes first.
- Review must allow user corrections instead of forcing pass/fail behavior.
- Entry point is per-project data import, not a global AI page.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-data-extraction*
*Context gathered: 2026-04-10*
