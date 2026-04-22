# Phase 11 Plan: Operations Control

## Goals
- [x] Create `project_incidents` table in Supabase.
- [x] Develop `use-incidents` hook for real-time data fetching.
- [x] Build the Dashboard `IncidentWidget`.
- [x] Implement the `IncidentHub` (/incidents) list view.
- [x] Implement the `IncidentDetail` page with status management.
- [x] Integrate incident status into the site map (pulsing markers).

## Tasks

### 1. Database Layer
- [x] Migration: `project_incidents.sql`.
- [x] RLS Policies for incident visibility.

### 2. API & Hooks
- [x] Fetch incidents with project joining.
- [x] Create transition mutations (Reported -> Investigating).

### 3. UI Components
- [x] `IncidentWidget`: Compact list with priority badges.
- [x] `IncidentMarker`: Pulsing effect logic in `ProjectMarker`.

### 4. Layout & Navigation
- [x] Side navigation entry for "Incidents".
- [x] Notifications view refinement.
