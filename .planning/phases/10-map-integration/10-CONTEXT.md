# Phase 10 Context: Map Integration

## Overview
Implementation of interactive maps using **Leaflet** to visualize project locations.

## Decisions
- **Library**: `react-leaflet` with `leaflet` core.
- **Iconology**: Standard pins (markers) with project-status colors.
- **Dynamic Imports**: Map components use `next/dynamic` with `ssr: false`.
- **Permissions**: Location is updated via project details (editing coordinates/pincodes); no direct drag-and-drop marker relocation.

## Technical Details

### Schema: `project_locations`
```sql
CREATE TABLE public.project_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    pincode TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for performance
CREATE INDEX idx_project_locations_project_id ON public.project_locations(project_id);
```

### Components
- `MapContainer`: Base wrapper.
- `DashboardMap`: Multi-marker view with clustering.
- `ProjectMiniMap`: Single marker view for detail pages.

## Status Mapping
- `on_track` -> Green
- `at_risk` -> Yellow
- `delayed` -> Red
- `completed` -> Blue
