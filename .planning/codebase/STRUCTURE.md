# Codebase Structure

**Analysis Date:** 2026-03-27

## Directory Layout

```
interactivedashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and core libraries
│   └── theme/                  # CSS theme files
├── public/                     # Static assets
├── .next/                      # Build output (generated)
├── node_modules/              # Dependencies (generated)
├── package.json                # Project configuration
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
├── postcss.config.mjs           # PostCSS config
└── eslint.config.mjs            # ESLint config
```

## Directory Purposes

### src/app/
- **Purpose:** Next.js App Router - all pages and layouts
- **Contains:** Route groups with layouts and page components
- **Key files:**
  - `layout.tsx` - Root layout with AuthProvider
  - `page.tsx` - Landing page
  - `(auth)/` - Login/reset routes
  - `(dashboard)/` - Protected routes with AppShell
  - `(builder)/` - Builder interface

### src/components/
- **Purpose:** All React UI components
- **Contains:** `ui/` (primitives), `features/` (domain), root-level components

**ui/ - Radix UI-based primitives:**
- `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`
- `sidebar.tsx`, `sheet.tsx`, `popover.tsx`, `tooltip.tsx`
- `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`
- `tabs.tsx`, `switch.tsx`, `progress.tsx`, `calendar.tsx`
- `table.tsx`, `separator.tsx`, `scroll-area.tsx`, `command.tsx`
- `badge.tsx`, `avatar.tsx`, `breadcrumb.tsx`, `skeleton.tsx`
- `empty-state.tsx`, `status-badge.tsx`, `kpi-card.tsx`

**features/ - Domain-specific components:**
- `project-card.tsx`, `task-list.tsx`, `output-tracker.tsx`
- `outcome-card.tsx`, `gantt-bar.tsx`

**Root-level components:**
- `app-shell.tsx` - Dashboard layout wrapper
- `page-header.tsx` - Page title and actions
- `chart-widget.tsx`, `map-widget.tsx` - Dashboard widgets
- `project-status-chart.tsx` - Pie chart
- `media-gallery.tsx`, `log-item.tsx` - Content display
- `data-import-modal.tsx` - Data import UI

### src/lib/
- **Purpose:** Core utilities and infrastructure
- **Key files:**
  - `firebase.ts` - Firebase client initialization
  - `auth.tsx` - Auth context and providers
  - `utils.ts` - `cn()` utility for class merging

### src/hooks/
- **Purpose:** Custom React hooks
- **Contains:** `use-mobile.ts` - Mobile breakpoint detection

### src/theme/
- **Purpose:** CSS theming with CSS custom properties
- **Contains:** `default.css`, `dark.css` - Theme variables

## Key File Locations

### Entry Points
- `src/app/layout.tsx` - Root layout, wraps all pages
- `src/app/page.tsx` - Landing page (unauthenticated)
- `src/app/(auth)/login/page.tsx` - Login page

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - Tailwind CSS v4 PostCSS config
- `components.json` - shadcn/ui component registry

### Core Logic
- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/auth.tsx` - Authentication context
- `src/lib/utils.ts` - Utility functions
- `src/components/app-shell.tsx` - Dashboard layout with sidebar

### Dashboard Pages
- `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `src/app/(dashboard)/projects/page.tsx` - Project list
- `src/app/(dashboard)/projects/[id]/page.tsx` - Project detail
- `src/app/(dashboard)/analytics/page.tsx` - Analytics
- `src/app/(dashboard)/tasks/page.tsx` - Tasks
- `src/app/(dashboard)/settings/page.tsx` - Settings

## Naming Conventions

### Files
- Components: `kebab-case.tsx` (e.g., `project-card.tsx`, `kpi-card.tsx`)
- Pages: `page.tsx` for route files
- Layouts: `layout.tsx` for wrapper components
- Utils: `kebab-case.ts` (e.g., `firebase.ts`, `utils.ts`)

### Directories
- General: `kebab-case` (e.g., `src/components/ui/`)
- Route groups: `(kebab-case)` (e.g., `(auth)`, `(dashboard)`)

### React Components
- Function components: `PascalCase` (e.g., `function AppSidebar()`)
- Exported components: `PascalCase` (e.g., `export function Button()`)
- Component files: `kebab-case.tsx` (e.g., `button.tsx`)

### TypeScript
- Interfaces: `PascalCase` with descriptive names (e.g., `ProjectCardProps`)
- Types: `PascalCase` (e.g., `User`, `AuthContextType`)

## Where to Add New Code

### New Feature Page
- **Primary code:** `src/app/(dashboard)/{feature}/page.tsx`
- **Layout:** `src/app/(dashboard)/{feature}/layout.tsx` (if needed)
- **Components:** `src/components/features/{feature-name}.tsx`
- **Tests:** Not currently present

### New UI Component
- **Implementation:** `src/components/ui/{component-name}.tsx`
- **Variants:** Use `cva` pattern (see `src/components/ui/button.tsx`)
- **Based on:** Radix UI primitives where applicable

### New Feature Component
- **Implementation:** `src/components/features/{component-name}.tsx`
- **Pattern:** Props interface with typed contracts
- **Dependencies:** Import from `src/lib/utils.ts`

### New Utility
- **Implementation:** `src/lib/{utility-name}.ts`
- **Pattern:** Named exports, TypeScript typed

### New Hook
- **Implementation:** `src/hooks/{hook-name}.ts`
- **Pattern:** Custom React hook with `use` prefix

### New Theme Variable
- **Implementation:** `src/theme/default.css` and `src/theme/dark.css`
- **Pattern:** CSS custom properties with `--` prefix

---

*Structure analysis: 2026-03-27*
