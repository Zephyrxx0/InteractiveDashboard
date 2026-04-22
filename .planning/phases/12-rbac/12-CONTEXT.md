# Phase 12 Context: RBAC & Governance

## Overview
Implementation of a robust **Role-Based Access Control (RBAC)** model to handle project-level permissions and global administrative governance. This ensures that field members see relevant data while project leads can manage their specific sectors.

## Decisions
- **Role Hierarchy**: 
  - `Admin`: Global control (Manage users, import data, system settings).
  - `Member`: Baseline access (View maps, file incidents).
- **Project Scoping**: `Project Lead` role within the `project_members` junction table allows granular administration without making everyone a Global Admin.
- **Identity Sync**: Firebase provides authentication, but Supabase `profiles` hold the application roles. A sync logic maps UID to Role on login.

## Technical Details

### Schema: `profiles`
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member'))
);
```

### Schema: `project_members`
```sql
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
    UNIQUE(project_id, profile_id)
);
```

### Key Logic
- `useRBAC()` hook: Unified access point for permission checks.
- `isAdmin`: Boolean helper for global actions.
- `isProjectLead(id)`: Helper for site-specific edit rights.

## UI Guarding
- **Dashboard**: "Import Data" button restricted to Admins.
- **Projects**: "Edit Project" and "Archive" restricted to Project Leads or Admins.
- **Incidents**: "Resolve" and "Assign" restricted to Project Leads or Admins.
