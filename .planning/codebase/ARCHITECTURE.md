# Architecture

**Analysis Date:** 2026-03-27

## Pattern Overview

**Overall:** Next.js App Router with Route Groups

**Key Characteristics:**
- Route groups `(auth)`, `(dashboard)`, `(builder)` for layout segmentation
- Firebase authentication with React Context providers
- Radix UI primitives for accessible UI components
- Tailwind CSS v4 with CSS variables for theming

## Layers

### Presentation Layer (src/components/)
- **Purpose:** UI components and visual elements
- Location: `src/components/`
- Contains: `ui/` (primitives), `features/` (domain components), general components
- Depends on: `lib/utils` for styling utilities

**UI Components (`src/components/ui/`):**
- Radix UI-based primitives: `button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sidebar.tsx`
- Custom components: `kpi-card.tsx`, `status-badge.tsx`, `page-header.tsx`
- Pattern: `cva` (class-variance-authority) for variant props

**Feature Components (`src/components/features/`):**
- Domain components: `project-card.tsx`, `task-list.tsx`, `output-tracker.tsx`, `gantt-bar.tsx`
- Pattern: Props interface with clear typed contracts

### Application Layer (src/app/)
- **Purpose:** Route handlers and page composition
- Location: `src/app/`
- Contains: Route groups with layouts and pages
- Depends on: Components, lib/auth, lib/firebase

**Route Groups:**
- `(auth)` - Public login/reset pages, no auth required
- `(dashboard)` - Protected dashboard pages with AppShell
- `(builder)` - Builder interface

### Core Layer (src/lib/)
- **Purpose:** Shared utilities and infrastructure
- Location: `src/lib/`
- Contains: Firebase config, auth context, utility functions

**Key Files:**
- `firebase.ts` - Firebase initialization (client-side only)
- `auth.tsx` - Auth context with Firebase Auth providers
- `utils.ts` - `cn()` utility for class merging

### Platform Layer (src/hooks/, src/theme/)
- **Purpose:** Cross-cutting concerns
- `src/hooks/use-mobile.ts` - Responsive breakpoint hook
- `src/theme/default.css`, `dark.css` - CSS variables for theming

## Data Flow

**Authentication Flow:**
1. Root layout (`src/app/layout.tsx`) wraps app in `AuthProvider`
2. Auth provider initializes Firebase auth on mount
3. Dashboard layout (`src/app/(dashboard)/layout.tsx`) uses `useRequireAuth()`
4. Unauthenticated users redirect to `/login`

**Page Rendering:**
1. Route matches file in `src/app/(dashboard)/`
2. Layout wraps page with `AppShell` (sidebar + header)
3. Page imports components from `src/components/`
4. Components use `cn()` from utils for conditional classes

## Key Abstractions

**Auth Context:**
- Purpose: Global authentication state
- Examples: `src/lib/auth.tsx`
- Pattern: React Context with Provider component

**Button Variants:**
- Purpose: Consistent button styling
- Examples: `src/components/ui/button.tsx`
- Pattern: `class-variance-authority` (CVA) with variant props

**KPI Card:**
- Purpose: Reusable metric display
- Examples: `src/components/ui/kpi-card.tsx`
- Pattern: Props for title, value, icon, trend

## Entry Points

**Root Entry:**
- Location: `src/app/layout.tsx`
- Triggers: Any page load
- Responsibilities: AuthProvider, TooltipProvider, font loading

**Landing Page:**
- Location: `src/app/page.tsx`
- Triggers: Unauthenticated user visits `/`
- Responsibilities: Marketing page, auto-redirect to dashboard if authenticated

**Dashboard:**
- Location: `src/app/(dashboard)/dashboard/page.tsx`
- Triggers: Authenticated user visits `/dashboard`
- Responsibilities: KPI cards, charts, maps, activity logs

**Project Detail:**
- Location: `src/app/(dashboard)/projects/[id]/page.tsx`
- Triggers: Authenticated user visits `/projects/{id}`
- Responsibilities: Project overview, metrics, details

## Error Handling

**Client-side:**
- Auth state loading: Show loading spinner while checking auth
- Missing Firebase config: Gracefully degrade (auth stays null)
- Auth redirects: `router.replace()` to avoid history stack pollution

**Firebase:**
- Environment variables: `NEXT_PUBLIC_FIREBASE_*` prefix for client-side access
- Null checks: `if (!auth)` guards to prevent errors without config

## Cross-Cutting Concerns

**Logging:** Not implemented - uses `console.log` for debugging
**Validation:** Not implemented - no form validation library
**Authentication:** Firebase Auth via React Context
**Theming:** Tailwind CSS v4 with CSS custom properties in `src/theme/`

---

*Architecture analysis: 2026-03-27*
