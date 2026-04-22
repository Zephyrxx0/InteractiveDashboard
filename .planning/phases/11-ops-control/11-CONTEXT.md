# Phase 11 Context: Operations Control

## Overview
Implementation of the **Incident Management System** to provide real-time field awareness and operational response. This phase transforms the dashboard from a reporting tool into a command-and-control center.

## Decisions
- **Source of Truth**: Supabase `project_incidents` table.
- **Priority Scale**: `low`, `medium`, `high`, `critical`. Critical incidents trigger a visual pulsing pin on the map.
- **Notifications**: Integrated into a central `Notification Hub` with toast alerts for high-priority items.
- **Workflow**: `Reported` -> `Investigating` -> `Resolved` -> `Closed`.

## Technical Details

### Schema: `project_incidents`
```sql
CREATE TABLE public.project_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'investigating', 'resolved', 'closed')),
    reporter_id UUID,
    assignee_id UUID,
    location_id UUID REFERENCES public.project_locations(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Key Components
- `IncidentWidget`: Dashboard-level priority list.
- `IncidentMarker`: Map integration (pulsing red state).
- `IncidentHub`: Full list view with filtering.
- `IncidentDetail`: Specialized page for triage and management.

## Integration
- **Map**: Markers check for active critical incidents in the current site.
- **Notifications**: New records in `project_incidents` should auto-trigger a notification log.
