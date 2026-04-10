---
phase: 08-supabase-data-layer-integration
plan: 04
subsystem: ui-integration
tags:
  - react-query
  - tasks
  - components
requires:
  - 08-03
provides:
  - "Live data connection for Tasks pages"
affects:
  - "src/app/(dashboard)/tasks/page.tsx"
  - "src/app/(dashboard)/projects/[id]/tasks/page.tsx"
tech-stack.added: []
key-files.created: []
key-files.modified:
  - "src/app/(dashboard)/tasks/page.tsx"
  - "src/app/(dashboard)/projects/[id]/tasks/page.tsx"
key-decisions:
  - "Kept the existing UI mock typings strictly mapped from the frontend schema via `useMemo` adapters to the backend structure to minimize disruption to existing components."
requirements-completed:
  - "DB-04"
---

# Phase 08 Plan 04: Hooks Integration for Tasks

Migrated the horizontal Tasks Hub and individual project task listing pages to use live data hooks mapping directly against the Supabase database.

Completed tasks:
- Replaced static `MOCK_TASKS` and `MOCK_PROJECTS` in `TasksPage` with `useTasks()` and `useProjects()`.
- Built inline adapter to convert `Database[...]['Row']` to the previous frontend `Task` interface to seamlessly wire into the `TaskList` component.
- Implemented `handleTaskUpdate` using `useUpdateTask()`.
- Carried identical changes over to `ProjectTasksPage`.

This marks the end of Phase 08 successfully.
