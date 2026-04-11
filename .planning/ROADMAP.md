# Roadmap: Interactive Dashboard Enhancement

**Created:** 2026-03-27
**Granularity:** standard
**Phases:** 9

## Phases

- [x] **Phase 1: Analytics Foundation** - Enhanced KPI cards, charts, date filtering, real-time updates, basic task management, code quality foundation
- [ ] **Phase 2: Task Management Enhancement** - Timeline/Gantt view, task dependencies, drag-drop rescheduling, zoom levels, advanced task features, code quality improvements
- [ ] **Phase 3: Media Management** - File upload, validation, compression, preview, download, media library
- [ ] **Phase 4: Reports & Export** - CSV export, PDF generation, report templates, export filtering
- [ ] **Phase 5: Phase 05 Polish** - Final refinements and bug fixes
- [ ] **Phase 6: Data Extraction (Gemma4)** - Local LLM for extracting data from XLSX, DOCX, CSV files

---

## Phase Details

### Phase 1: Analytics Foundation
**Goal:** Users can view enhanced analytics with KPI cards, charts, and real-time data, plus manage tasks with basic features

**Depends on:** Nothing (first phase)

**Requirements:** AN-01, AN-02, AN-03, AN-04, AN-05, AN-06, TM-01, TM-02, TM-03, TM-04, CQ-01, CQ-02

**Success Criteria** (what must be TRUE):
1. User can view KPI cards showing project metrics with trend indicators (up/down arrows)
2. User can see line charts displaying trend data over time
3. User can see bar charts comparing categorical data
4. User can see pie/donut charts showing distribution data
5. User can filter all charts by date range (last 7 days, 30 days, custom range)
6. User can see analytics data update in real-time without page refresh
7. User can edit tasks inline in task list
8. User can change task status (todo, in-progress, done, blocked)
9. User can view and set due dates with calendar picker
10. User can assign tasks to team members and filter by assignee

**Plans:** 4 plans

Plans:
- [x] 01-01-PLAN.md — Install Recharts, create SSR-safe chart wrappers (Line, Bar, Pie)
- [x] 01-02-PLAN.md — Enhanced KPI cards, DateRangePicker, analytics page composition
- [x] 01-03-PLAN.md — Task types, inline editing, status workflow, filtering
- [x] 01-04-PLAN.md — Real-time Firebase data hooks, TypeScript strict mode, ESLint

**UI hint:** yes

---

### Phase 2: Task Management Enhancement
**Goal:** Users can visualize tasks in timeline/Gantt view with dependencies and drag-drop rescheduling

**Depends on:** Phase 1

**Requirements:** TM-05, TM-06, TM-07, TM-08, CQ-03, CQ-04

**Success Criteria** (what must be TRUE):
1. User can view all tasks in a Gantt/timeline visualization
2. User can drag tasks to reschedule dates
3. User can link tasks to show dependencies
4. User can switch between day/week/month zoom levels
5. User can zoom out to see task overview across extended time periods

**Plans:** 4 plans (including gap closure)

Plans:
- [x] 02-01-PLAN.md — Gantt types, custom GanttChart with zoom levels (day/week/month)
- [x] 02-02-PLAN.md — Drag-drop rescheduling, dependency lines between tasks
- [x] 02-03-PLAN.md — Timeline page integration, tooltips, documentation
- [x] 02-04-PLAN.md — animejs v4 API migration
- [x] 02-05-PLAN.md — Wire GanttTaskRow, add JSDoc documentation
- [x] 02-06-PLAN.md — Fix z-index conflict for arrow removal, wire GanttTaskRow

**UI hint:** yes

---

### Phase 3: Media Management
**Goal:** Users can upload, manage, and download media files for projects

**Depends on:** Phase 2

**Requirements:** MM-01, MM-02, MM-03, MM-04, MM-05, MM-06

**Success Criteria** (what must be TRUE):
1. User can upload files with visible progress indicator
2. User can only upload allowed file types (images, documents)
3. User receives error message when file exceeds size limit
4. User can preview images with generated thumbnails
5. User can download any uploaded file
6. User can view all uploaded files in a grid library view

**Plans:** 3 plans

Plans:
- [x] 03-01-PLAN.md — Install react-dropzone, file validation, FileDropzone component
- [x] 03-02-PLAN.md — Firebase Storage upload with progress, thumbnails, download
- [x] 03-03-PLAN.md — MediaLibrary grid view, media page with upload dialog

**UI hint:** yes

---

### Phase 4: Reports & Export
**Goal:** Users can generate and export reports in multiple formats

**Depends on:** Phase 3

**Requirements:** RP-01, RP-02, RP-03, RP-04

**Success Criteria** (what must be TRUE):
1. User can export task data to CSV format
2. User can generate and download PDF reports
3. User can select from summary report templates
4. User can filter exports by date range

**Plans:** 4 plans

Plans:
- [x] 04-01-PLAN.md — Export types, CSV export with date filtering
- [x] 04-02-PLAN.md — Install @react-pdf/renderer, PDF templates (Summary, Detailed)
- [x] 04-03-PLAN.md — Reports page with preview, quick export cards
- [x] 04-04-PLAN.md — Gap Closure: Add template selector to PDF exports

**UI hint:** yes

---

### Phase 5: Phase 05 Polish
**Goal:** Final refinements and bug fixes

**Depends on:** Phase 4

**Requirements:** N/A (polish)

**Success Criteria** (what must be TRUE):
1. Code quality improvements from previous phases maintained

**Plans:** 1 plan

Plans:
- [x] 05-01-PLAN.md — Polish phase for refinements

**UI hint:** no

---

### Phase 6: Data Extraction (Gemma4)
**Goal:** Extract structured data from imported files (XLSX, DOCX, CSV) using local Gemma4 LLM via Docker

**Depends on:** Phase 5

**Requirements:** DE-01, DE-02, DE-03, DE-04, DE-05, DE-06, DE-07, DE-08

**Success Criteria** (what must be TRUE):
1. User can import XLSX files and extract structured data rows
2. User can import DOCX files and extract text content
3. User can import CSV files and extract tabular data
4. Extracted data is presented in editable review table
5. Data is validated with confidence indicators
6. User can save extracted data to project
7. Processing happens asynchronously with progress indication
8. User can retry failed extractions

**Plans:** 1 plan

Plans:
- [ ] 06-01-PLAN.md — Gemma4 integration, file parsers, extraction UI

**UI hint:** yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Analytics Foundation | 4/4 | Complete | 2026-03-27 |
| 2. Task Management Enhancement | 6/6 | Complete | - |
| 3. Media Management | 3/3 | Complete | - |
| 4. Reports & Export | 4/4 | Complete | - |
| 5. Phase 05 Polish | 1/1 | Complete | - |
| 6. Data Extraction (Gemma4) | 0/1 | Planned | - |
| 7. document imports unstructured files | 0/0 | Planned | - |
| 8. Supabase Data Layer Integration | 4/4 | Complete | 2026-04-10 |
| 9. Gemma4 Dev Integration | 0/4 | Planned | - |

### Phase 7: document imports unstructured files

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 7 to break down)

### Phase 8: Supabase Data Layer Integration

**Goal:** Implement a persistent data layer using Supabase while maintaining hardcoded authentication for initial development.
**Requirements**: DB-01, DB-02, DB-03, DB-04
**Depends on:** Phase 7
**Plans:** 4 plans

Plans:
- [ ] 08-01-PLAN.md — Foundation: Supabase Client & Hardcoded Auth
- [ ] 08-02-PLAN.md — Database Schema: Tables & Types Migration
- [ ] 08-03-PLAN.md — Data Hooks: Projects & Tasks (React Query)
- [ ] 08-04-PLAN.md — UI Integration: Migrating Tasks Hub & Projects


### Phase 9: Gemma4 Dev Integration

**Goal:** Enable AI-powered extraction of NGO project data from uploaded files using local Gemma 4 (9b/dev) via Ollama.
**Requirements**: DE-01, DE-02, DE-03, DE-04, DE-05, DE-06, DE-07, DE-08
**Depends on:** Phase 8
**Plans:** 4 plans

Plans:
- [x] 09-01-PLAN.md — Setup: Ollama local installation and gemma4:9b model pull
- [x] 09-02-PLAN.md — API: Next.js /api/extract endpoint development with Ollama integration
- [x] 09-03-PLAN.md — Parsers: Implementation of deterministic file parsers (DOCX, CSV, XLSX)
- [x] 09-04-PLAN.md — Integration: UI upload flow and data layer storage for extracted results

---

*Roadmap created: 2026-03-27*
*Plans created: 2026-03-27*
