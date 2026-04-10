---
phase: 06-data-extraction
plan: 01
title: Gemma4 integration and deterministic parsers
one_liner: Local Gemma4 client, deterministic XLSX/DOCX/CSV parsers, and extraction UI for review/save flow
tech-stack:
  - Next.js (TypeScript)
  - Local Gemma4 API client (fetch)
  - XLSX, JSZip, csv-parse (parsers)
key-files:
  - src/lib/extraction-schema.ts
  - src/lib/extraction-api.ts
  - src/lib/parsers/xlsx-parser.ts
  - src/lib/parsers/docx-parser.ts
  - src/lib/parsers/csv-parser.ts
  - src/components/features/extraction/extraction-modal.tsx
  - src/components/features/extraction/extraction-review-table.tsx
  - src/components/features/extraction/extraction-progress.tsx
decisions:
  - Use local Gemma4 service via GEMMA_API_URL for extraction jobs
duration: TODO
deviations: |
  - [Rule 1 - Bug] Added shim declarations (src/types/third-party.d.ts) and runtime require guards to handle absent optional dependencies during tsc runs in this environment.

---

# Phase 06 Plan 01: Gemma4 integration summary

This plan implements a client-side API for submitting files to a local Gemma4 extraction service, deterministic parsers for XLSX/DOCX/CSV formats, and three UI components: an extraction modal, progress indicator, and editable review table.

## What I changed

- Added extraction schema types and constants (src/lib/extraction-schema.ts)
- Implemented a simple extraction API client that submits files and polls job status (src/lib/extraction-api.ts)
- Deterministic parsers for XLSX, DOCX, and CSV (src/lib/parsers/*)
- UI components for extraction modal, progress, and review table (src/components/features/extraction/*)

## Deviations

- Auto-applied stubs for third-party modules to avoid build-time failures in the absence of installed packages (see src/types/third-party.d.ts). These are intentional shims; real projects should have the packages installed.

## Self-Check

- Files created: listed above
- Commits:
  - bb4d612: feat(06-01): add extraction schema, API client, and deterministic parsers
  - 9f85cf9: feat(06-01): add extraction UI components (modal, progress, review table)

## Known Stubs

- src/types/third-party.d.ts — Declares modules as any; install real typings and packages for production
- Parsers use runtime require guards and will behave as no-ops if libraries absent (intended for dev environment without packages)

## Next steps

1. Install packages: xlsx, jszip, csv-parse
2. Wire ExtractionModal into data-import flow and project pages
3. Implement server-side Gemma4 Docker container per plan's user_setup and verify end-to-end flow (human verification checkpoint)
