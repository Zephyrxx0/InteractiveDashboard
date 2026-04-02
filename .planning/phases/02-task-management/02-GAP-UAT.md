---
status: diagnosed
phase: 02-task-management-gap-closure
source: [02-04-PLAN.md, 02-05-PLAN.md]
started: 2026-04-01T16:30:00Z
updated: 2026-04-01T16:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. animejs v4 API Migration
expected: GanttChart component renders without "animeInstance is not a function" error. Dependency lines animate smoothly using animejs v4 API with `import { animate } from 'animejs'`.
result: issue
reported: "Cant remove already connected arrows"
severity: major

### 2. GanttTaskRow Tooltips
expected: Hovering on a task bar reveals a rich tooltip with task details (name, dates, assignee, progress). Task names are visible in the left sidebar.
result: issue
reported: "Still disconnect arrows between two nodes"
severity: major

### 3. JSDoc Documentation
expected: All Gantt components (GanttChart, GanttTaskBar, useGanttDrag, GanttDependencyLine) have JSDoc documentation explaining their purpose and props.
result: pass

## Summary

total: 3
passed: 1
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "GanttChart component renders without animejs error - dependency lines animate smoothly"
  status: failed
  reason: "User reported: Cant remove already connected arrows"
  severity: major
  test: 1
  root_cause: "Z-index conflict - task nodes have z-10 while SVG dependency layer has z-5. Arrow click events are intercepted by higher z-index task nodes."
  artifacts:
    - path: "src/components/features/gantt/gantt-chart.tsx"
      issue: "SVG dependency layer z-index is 5, below task nodes at z-10"
    - path: "src/components/features/gantt/gantt-task-bar.tsx"
      issue: "Task nodes positioned at -1.5px outside task bar with z-10"
  missing:
    - "Increase SVG dependency layer z-index to 20+ above task nodes"
    - "OR add pointer-events-none to nodes when not in connection mode"
  debug_session: .planning/debug/gantt-arrow-issues.md
- truth: "Hovering on task bar reveals rich tooltip - Task names visible in left sidebar"
  status: failed
  reason: "User reported: Still disconnect arrows between two nodes"
  severity: major
  test: 2
  root_cause: "Same z-index issue as Test 1 - clicking nodes triggers new connections (handleNodeClick) instead of removing arrows. Arrows appear disconnected because new connections overwrite them or removal fails."
  artifacts:
    - path: "src/components/features/gantt/gantt-chart.tsx"
      issue: "handleNodeClick fires on node click, intercepts arrow clicks"
  missing:
    - "Same fix as Test 1 - increase z-index or use pointer-events"
  debug_session: .planning/debug/gantt-arrow-issues.md