---
status: diagnosed
trigger: "Diagnose the root causes: (1) Cant remove already connected arrows - Issue from Test 1, (2) Still disconnect arrows between two nodes - Issue from Test 2"
created: 2026-04-02T00:00:00Z
updated: 2026-04-02T00:00:00Z
---

## Current Focus

hypothesis: Z-index conflict between task nodes and dependency arrows, plus missing pointer-events handling
test: Examined SVG layer z-index vs task row z-index, and pointer-events on interactive elements
expecting: Arrow click events are being intercepted by overlapping task nodes
next_action: Document root causes for both issues

## Symptoms

### Issue 1: "Cant remove already connected arrows"
expected: Clicking on a dependency arrow should remove the connection
actual: Click doesn't remove the arrow / error occurs
reproduction: Click on any dependency arrow between two tasks

### Issue 2: "Still disconnect arrows between two nodes"
expected: Arrow should remain connected between two nodes
actual: Arrows unexpectedly disconnect between tasks
reproduction: When hovering/interacting with task nodes, arrows disconnect

started: Both issues reported in GAP-UAT (02-GAP-UAT.md)

## Evidence

- timestamp: 2026-04-02T00:05:00Z
  checked: gantt-chart.tsx line 288-313 (SVG layer)
  found: Dependency arrows SVG has z-index: 5 via style prop
  implication: SVG layer is below task rows (z-10) and task nodes (z-10)

- timestamp: 2026-04-02T00:10:00Z
  checked: gantt-task-bar.tsx line 55-69 (start node)
  found: Start node at position -left-1.5 extends beyond task bar left edge, z-10
  implication: Node visual area overlaps with SVG layer where arrows are drawn

- timestamp: 2026-04-02T00:15:00Z
  checked: gantt-task-bar.tsx line 117-132 (end node)
  found: End node at position -right-1.5 extends beyond task bar right edge, z-10
  implication: Node visual area overlaps with SVG layer where arrows terminate

- timestamp: 2026-04-02T00:20:00Z
  checked: gantt-dependency-line.tsx line 55-67 (path calculation)
  found: Arrow path connects from fromX (end of source task) to toX (start of target task), with padding=12
  implication: Arrow endpoints are at same X position as task nodes, creating overlap zone

- timestamp: 2026-04-02T00:25:00Z
  checked: gantt-dependency-line.tsx line 70-93 (arrow click handling)
  found: Arrow has onClick handler calling onRemove(fromTask.id, toTask.id)
  implication: Arrow should trigger removal, but click may be intercepted

- timestamp: 2026-04-02T00:30:00Z
  checked: gantt-task-bar.tsx line 65-68 (node click handler)
  found: Node has onClick that calls onNodeClick(task.id, nodeType), stops propagation
  implication: When clicking near arrow endpoint, node click may fire instead of arrow click

- timestamp: 2026-04-02T00:35:00Z
  checked: gantt-chart.tsx line 106-129 (handleNodeClick logic)
  found: Clicking start node of one task and end node of another triggers onConnectionAdd
  implication: Accidental node clicks during arrow hover can create NEW connections while trying to remove

## Resolution

root_cause: Two related issues caused by z-index conflict and click handling overlap:

**Issue 1 - "Cant remove already connected arrows":**
The SVG layer for dependency arrows has z-index: 5, while task nodes have z-index: 10. The task nodes (positioned at -left-1.5 and -right-1.5 relative to task bar) visually overlap with arrow endpoints. When user attempts to click an arrow to remove it, the higher z-index task node intercepts the click. The node's onClick handler fires (calling handleNodeClick for connection) instead of the arrow's onClick (calling onConnectionRemove).

**Issue 2 - "Still disconnect arrows between two nodes":**
The handleNodeClick function in gantt-chart.tsx:106-129 has connection-creation logic that doesn't require drag-and-drop - it just requires clicking one node then another. If a user hovers near an arrow and the nodes become visible (opacity-100 on hover), accidental clicks on nodes can trigger the connection logic. Additionally, even when not creating connections, clicking nodes doesn't remove arrows - so users may think arrows are "disconnecting" because the click isn't working as expected.

fix: (1) Increase SVG z-index to be above task nodes (z-20 or higher), OR (2) Add pointer-events: none to task nodes when not in connection mode, OR (3) Add visual separation between nodes and arrow endpoints to prevent click overlap, OR (4) All of the above combined.

verification: Test both issues by clicking arrows at various positions, and verify that node hover/click doesn't accidentally trigger connection logic

files_changed: []