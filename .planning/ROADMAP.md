# Roadmap: Interactive Dashboard Enhancement

**Created:** 2026-03-27
**Granularity:** standard
**Phases:** 4

## Phases

- [ ] **Phase 1: Analytics Foundation** - Enhanced KPI cards, charts, date filtering, real-time updates, basic task management, code quality foundation
- [ ] **Phase 2: Task Management Enhancement** - Timeline/Gantt view, task dependencies, drag-drop rescheduling, zoom levels, advanced task features, code quality improvements
- [ ] **Phase 3: Media Management** - File upload, validation, compression, preview, download, media library
- [ ] **Phase 4: Reports & Export** - CSV export, PDF generation, report templates, export filtering

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
- [ ] 01-02-PLAN.md — Enhanced KPI cards, DateRangePicker, analytics page composition
- [ ] 01-03-PLAN.md — Task types, inline editing, status workflow, filtering
- [ ] 01-04-PLAN.md — Real-time Firebase data hooks, TypeScript strict mode, ESLint

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

**Plans:** 3 plans

Plans:
- [ ] 02-01-PLAN.md — Gantt types, custom GanttChart with zoom levels (day/week/month)
- [ ] 02-02-PLAN.md — Drag-drop rescheduling, dependency lines between tasks
- [ ] 02-03-PLAN.md — Timeline page integration, tooltips, documentation

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
- [ ] 03-01-PLAN.md — Install react-dropzone, file validation, FileDropzone component
- [ ] 03-02-PLAN.md — Firebase Storage upload with progress, thumbnails, download
- [ ] 03-03-PLAN.md — MediaLibrary grid view, media page with upload dialog

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

**Plans:** 3 plans

Plans:
- [ ] 04-01-PLAN.md — Export types, CSV export with date filtering
- [ ] 04-02-PLAN.md — Install @react-pdf/renderer, PDF templates (Summary, Detailed)
- [ ] 04-03-PLAN.md — Reports page with preview, quick export cards

**UI hint:** yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Analytics Foundation | 0/4 | Planned | - |
| 2. Task Management Enhancement | 0/3 | Planned | - |
| 3. Media Management | 0/3 | Planned | - |
| 4. Reports & Export | 0/3 | Planned | - |

---

*Roadmap created: 2026-03-27*
*Plans created: 2026-03-27*
