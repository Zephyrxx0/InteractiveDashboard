# Phase 06: data extraction - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `06-CONTEXT.md`.

**Date:** 2026-04-10
**Phase:** 06-data-extraction
**Areas discussed:** Deployment model, Data schema, File formats, UI integration, Security & access, Performance & jobs, Error & review flow, Canonical refs

---

## Deployment model

| Option | Description | Selected |
|--------|-------------|----------|
| Separate local API service | Next.js app calls a dedicated local service in front of Gemma4 | ✓ |
| Next.js route proxy | App-owned server routes proxy to local model | |
| Client calls model directly | Browser talks directly to model endpoint | |

**User's choice:** Separate local API service
**Notes:** Best fit because the current app has no dedicated backend service layer.

---

## Data schema

| Option | Description | Selected |
|--------|-------------|----------|
| Structured JSON + rows | Normalized JSON envelope plus extracted records | ✓ |
| Rows only | Tabular output with minimal metadata | |
| Narrative summary + rows | Human summary and row data as first-class outputs | |

**User's choice:** Structured JSON + rows
**Notes:** The phrase “systematic format” was locked to structured output, not narrative-only output.

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid canonical core | Shared core schema plus source-specific extension fields | ✓ |
| One canonical schema only | Force all sources into one strict schema | |
| Per-source schemas | Separate schema per source type | |

**User's choice:** Hybrid canonical core
**Notes:** This supports both the YRA spreadsheet inputs and unstructured DOCX extraction.

---

## File formats

| Option | Description | Selected |
|--------|-------------|----------|
| XLSX + DOCX first | Focus only on the provided references | |
| XLSX + DOCX + CSV | Support all three formats in initial scope | ✓ |
| XLSX only first | Narrow initial scope to spreadsheets only | |

**User's choice:** XLSX + DOCX + CSV
**Notes:** The user explicitly widened initial support beyond only the required spreadsheet.

| Option | Description | Selected |
|--------|-------------|----------|
| Parse first, Gemma enriches | Deterministic spreadsheet parse then LLM normalization | ✓ |
| Gemma reads raw file content | LLM-only spreadsheet understanding | |
| Rules only, no Gemma for XLSX | Deterministic spreadsheet mapping only | |

**User's choice:** Parse first, Gemma enriches
**Notes:** Spreadsheet extraction should not rely on raw LLM handling alone.

| Option | Description | Selected |
|--------|-------------|----------|
| Text extraction then Gemma structures | Deterministic DOCX text extraction then LLM structuring | ✓ |
| Gemma-only pipeline | No deterministic pre-processing | |
| Manual mapping only | Human reference-only workflow | |

**User's choice:** Text extraction then Gemma structures
**Notes:** DOCX processing still uses deterministic extraction before the model step.

---

## UI integration

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Data Extraction page | New standalone dashboard page | |
| Reuse import modal inside existing pages | Extend current import pattern | |
| Per-project import flow | Start extraction from each project | ✓ |

**User's choice:** Data import is in each project, implement there
**Notes:** This narrows the integration point to project-scoped workflows.

| Option | Description | Selected |
|--------|-------------|----------|
| Review table with editable mappings | Editable normalized table with manual correction | ✓ |
| Read-only preview then confirm | Non-editable review step | |
| Summary card view first | Start with high-level summary cards | |

**User's choice:** Review table with editable mappings
**Notes:** Review and correction are required before save/export.

---

## Security & access

| Option | Description | Selected |
|--------|-------------|----------|
| Authenticated project members only | Restrict extraction to project members | ✓ |
| Any authenticated user | App-wide signed-in access | |
| Admin-only | Restrict to admins/managers | |

**User's choice:** Authenticated project members only
**Notes:** Access control is project-scoped.

| Option | Description | Selected |
|--------|-------------|----------|
| Local-only processing | No third-party model calls, local Docker only | ✓ |
| Local default, cloud fallback | Optional remote fallback | |
| No strict locality requirement | Future deployment can vary | |

**User's choice:** Local-only processing
**Notes:** Data privacy/locality is a locked requirement for this phase.

---

## Performance & jobs

| Option | Description | Selected |
|--------|-------------|----------|
| Async job with progress | Submit extraction and monitor job status | ✓ |
| Synchronous request | Wait for the response on the same screen | |
| Hybrid by file size | Sync for small files, async for large | |

**User's choice:** Async job with progress
**Notes:** Best fit for heavier DOCX/XLSX processing.

---

## Error & review flow

| Option | Description | Selected |
|--------|-------------|----------|
| Flag fields/rows for manual review | Keep partial results and highlight uncertainty | ✓ |
| Fail whole extraction | Reject if confidence is low | |
| Auto-accept everything | Never require review | |

**User's choice:** Flag fields/rows for manual review
**Notes:** Review table must support corrections.

| Option | Description | Selected |
|--------|-------------|----------|
| Show error + retry + raw parse preview | Explicit failure UI plus fallback preview | ✓ |
| Show error only | No fallback preview | |
| Silently skip bad sections | Partial silent output | |

**User's choice:** Show error + retry + raw parse preview
**Notes:** Deterministic parse preview is the fallback when full extraction fails.

---

## Canonical refs

| Option | Description | Selected |
|--------|-------------|----------|
| Use all listed feat_guide refs | Include DOCX and both spreadsheet samples | ✓ |
| Use February 2024 only | Restrict canonical input to the required sheet | |
| Use custom subset | User defines exact refs | |

**User's choice:** Use all listed feat_guide refs
**Notes:** The DOCX reference and both December 2023 / February 2024 spreadsheets are canonical references.

---

## Agent's Discretion

- Exact normalized field names and envelope structure
- Exact UI presentation details for progress and review states
- Exact job orchestration mechanism between the app and the local service

## Deferred Ideas

None — discussion stayed within phase scope
