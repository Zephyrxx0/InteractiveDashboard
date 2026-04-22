# Phase 12 Plan: RBAC & Governance

## Goals
- [x] Define global role hierarchy (Admin/Member).
- [x] Create `profiles` and `project_members` tables.
- [x] Implement Auth Synchronization (Firebase UID -> Supabase Role).
- [x] Develop `useRBAC` hook for easy permission checks.
- [x] Guard critical UI actions (Import, Edit, Resolve) with role checks.

## Tasks

### 1. Security Schema
- [x] Migration: `rbac_schema.sql`.
- [x] Enable RLS on core tables (Projects, Tasks, Incidents) with role-based policies.

### 2. Logic Integration
- [x] Update `src/lib/auth.tsx` to fetch Supabase profiles on state change.
- [x] Create `src/hooks/use-rbac.ts`.

### 3. UI Implementation
- [x] Wrap Admin-only buttons with role check icons or conditional rendering.
- [x] Update Dashboard header actions (Import Data) to check `isAdmin`.

### 4. Verification
- [x] Verify Member can log in but cannot see Admin controls.
- [x] Verify Admin can access all project-level settings.
