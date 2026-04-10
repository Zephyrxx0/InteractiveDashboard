# Phase 07: document imports unstructured files - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase documents and validates the complete imports workflow for unstructured files after Phase 6 (Data Extraction with Gemma4). It creates canonical reference documentation, validation tests, and example outputs that demonstrate the extraction pipeline from raw file through normalized data.

</domain>

<decisions>
## Implementation Decisions

### Scope
- **D-01:** Phase 7 focuses on documentation, examples, and validation—not new code
- **D-02:** Creates reference documents showing expected input/output for each supported format
- **D-03:** Validates extraction results against known-good sample data

### Documentation targets
- **D-04:** Reference guide for XLSX import with expected schema mapping
- **D-05:** Reference guide for DOCX import with expected structure  
- **D-06:** Reference guide for CSV import with edge cases
- **D-07:** Validation test suite confirming extraction accuracy

### Output artifacts
- **D-08:** Import guide documents in feat_guide/ for each format
- **D-09:** Expected-output JSON files for validation
- **D-10:** Test script confirming extraction pipeline correctness

### Agent's Discretion
- Exact documentation format (markdown, JSON, or mix)
- Specific validation metrics to measure
- Example edge cases to document

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 6 context
- `.planning/phases/06-data-extraction/06-CONTEXT.md` — extraction architecture
- `.planning/phases/06-data-extraction/06-01-PLAN.md` — extraction implementation plan
- `.planning/phases/06-data-extraction/06-01-SUMMARY.md` — extraction results (if exists)

### Sample inputs from Phase 6
- `feat_guide/YRA/MPPR Data folder/December 2023.xlsx` — spreadsheet input
- `feat_guide/YRA/MPPR Data folder/February 2024.xlsx` — spreadsheet input
- `feat_guide/unstructered_docs.docx` — document input

### Code context
- `src/lib/parsers/xlsx-parser.ts` — XLSX parsing from Phase 6
- `src/lib/parsers/docx-parser.ts` — DOCX parsing from Phase 6
- `src/lib/parsers/csv-parser.ts` — CSV parsing from Phase 6
- `src/lib/extraction-schema.ts` — schema definitions from Phase 6

</canonical_refs>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-document-imports-unstructured-files*
*Context gathered: 2026-04-10*