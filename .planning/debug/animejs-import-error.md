---
status: diagnosed
trigger: "Diagnose the root cause of the 'animeInstance is not a function' error blocking all GanttChart functionality."
created: 2026-04-01T00:00:00Z
updated: 2026-04-01T00:35:00Z
---

## Current Focus

hypothesis: CONFIRMED - animejs v4 breaking API change
test: examined runtime exports vs code expectations
expecting: mismatch between v3 API usage and v4 implementation
next_action: document root cause for plan-phase --gaps

## Symptoms

expected: GanttChart component should render with animated dependency lines using animejs library
actual: Component crashes on mount with TypeError: "animeInstance is not a function" at line 106
errors: TypeError: animeInstance is not a function at GanttChart.useEffect (src/components/features/gantt/gantt-chart.tsx:106:7)
reproduction: Load any timeline page (/projects/[id]/timeline)
started: Discovered during Phase 02 UAT - all 5 tests fail with same error

## Eliminated

## Evidence

- timestamp: 2026-04-01T00:05:00Z
  checked: gantt-chart.tsx line 4
  found: `import * as anime from 'animejs';` - namespace import attempting to access .default or call as function
  implication: Import pattern assumes animejs v3 CommonJS structure with default export

- timestamp: 2026-04-01T00:10:00Z
  checked: package.json line 13
  found: `"animejs": "^4.3.6"` installed
  implication: Using animejs v4, not v3

- timestamp: 2026-04-01T00:15:00Z
  checked: @types/animejs package.json
  found: `"version": "3.1.13"` - TypeScript types are for anime v3 API
  implication: Type definitions do NOT match runtime library version

- timestamp: 2026-04-01T00:20:00Z
  checked: node_modules/animejs/dist/modules/index.js
  found: No default export. Exports: `animate`, `createTimeline`, `utils.setDashoffset`, etc. as named exports
  implication: animejs v4 is pure ESM with named exports only

- timestamp: 2026-04-01T00:25:00Z
  checked: node_modules/@types/animejs/index.d.ts
  found: `declare function anime(params: anime.AnimeParams): anime.AnimeInstance;` and `export = anime;` (CommonJS)
  implication: Types define anime as default function export (v3 API), but runtime v4 has no such export

- timestamp: 2026-04-01T00:35:00Z
  checked: node_modules/animejs/dist/modules/svg/drawable.js lines 40-80
  found: v4 uses `createDrawable()` + `draw` attribute for SVG animation, not setDashoffset helper
  implication: animejs v4 has completely different SVG animation API - requires rewrite, not just import fix

## Resolution

root_cause: animejs v4.3.6 major breaking API changes - v3 exported default function `anime()` with helper `anime.setDashoffset`, but v4 uses named export `animate()` with completely restructured API. Code at gantt-chart.tsx:104-112 expects v3 API (anime({targets, strokeDashoffset: [anime.setDashoffset, 0]})) but v4 requires different approach (animate() + createDrawable() for SVG paths, or direct strokeDashoffset animation). Type mismatch exacerbates issue (@types/animejs@3.1.13 vs animejs@4.3.6).
fix: Either (1) downgrade animejs to v3.x for backward compatibility, OR (2) rewrite animation code to use v4 API with animate() and createDrawable() for SVG path drawing
verification: Component mounts without error, dependency lines animate on load and zoom change
files_changed: [src/components/features/gantt/gantt-chart.tsx, package.json (if downgrade chosen)]
