# Codebase Concerns

**Analysis Date:** 2026-03-27

## Build Errors (Critical)

### TypeScript Module Resolution Failures
- **Issue:** TypeScript cannot find module paths for several pages
- **Files:** `.next/dev/types/validator.ts` (lines 42, 60, 69), `.next/types/validator.ts` (lines 42, 60, 69)
- **Missing modules:**
  - `src/app/import/page.js`
  - `src/app/projects/[id]/page.js`
  - `src/app/projects/page.js`
- **Impact:** TypeScript build errors, potential type-checking failures
- **Fix approach:** Either create these missing page files or remove references from the codebase

### Firebase Auth Build Failure
- **Issue:** Build fails during prerender of `/login/reset` due to invalid Firebase API key
- **Files:** `src/lib/auth.tsx`
- **Error:** `FirebaseError: auth/invalid-api-key`
- **Trigger:** Running `next build` without valid Firebase credentials in `.env`
- **Impact:** Production builds fail completely
- **Fix approach:** Add environment variable validation or create mock auth for build-time, or ensure `.env.local` has valid Firebase config during build

## Security Considerations

### Hardcoded Credentials in UI
- **Risk:** Display name and role are hardcoded in components
- **Files:** `src/components/app-shell.tsx` (lines 186-196)
- **Current mitigation:** None - uses hardcoded "J. Doe" and "Admin"
- **Recommendations:** Replace with actual user data from AuthContext

### Type Safety Gaps
- **Risk:** Using `any` type for Firebase app and auth instances
- **Files:** `src/lib/firebase.ts` (lines 14-15)
- **Current mitigation:** Runtime checks before usage
- **Recommendations:** Define proper Firebase types or use typed wrappers

### Environment Variable Exposure
- **Risk:** Firebase config uses client-side env vars (NEXT_PUBLIC_*)
- **Files:** `src/lib/firebase.ts`
- **Current mitigation:** Check for `firebaseConfig.apiKey` before initialization
- **Recommendations:** Document required env vars, add validation error messages

## Missing Critical Features

### No Backend/API Layer
- **Problem:** No API routes implemented
- **Blocks:** All data operations, user management, CRUD functionality
- **Impact:** Application is purely frontend with no persistence

### No Data Persistence
- **Problem:** No Firestore or database integration for storing data
- **Files:** `src/lib/firebase.ts` initializes app but no data operations
- **Impact:** All data is hardcoded or ephemeral

### No Role-Based Access Control (RBAC)
- **Problem:** No permission system implemented
- **Blocks:** User roles, team management, access control for dashboards/widgets
- **Impact:** All users have same permissions (or no auth checks)

## Tech Debt

### Unused/Missing Page Routes
- **Issue:** Routes referenced in types don't exist
- **Files:** No `src/app/import/`, `src/app/projects/` pages created
- **Impact:** Broken navigation if linked, TypeScript errors in build
- **Fix approach:** Create placeholder pages or remove referenced routes

### Auth Context Incomplete
- **Issue:** Auth provides user state but no user management functions
- **Files:** `src/lib/auth.tsx`
- **Current state:** Has signIn, signInWithGoogle, signOut - missing: updateProfile, password reset, email verification
- **Fix approach:** Add remaining Firebase auth methods to AuthContext

### Unused Builder Route Group
- **Issue:** Route group `(builder)` exists but may be incomplete
- **Files:** `src/app/(builder)/dashboard/builder/page.tsx`
- **Impact:** Dead code if not used
- **Fix approach:** Either complete or remove the builder feature

## Performance Bottlenecks

### No Data Fetching Optimization
- **Problem:** No React Query, SWR, or similar data fetching library
- **Impact:** Manual useEffect data loading, no caching, no deduping
- **Improvement path:** Add TanStack Query for server state management

### No Lazy Loading
- **Problem:** All components loaded synchronously
- **Impact:** Large bundle size, slow initial load
- **Improvement path:** Implement Next.js dynamic imports for heavy components

### No Virtualization
- **Problem:** Rendering large lists without virtualization
- **Files:** `src/components/features/task-list.tsx`, other list components
- **Impact:** Poor performance with large datasets
- **Improvement path:** Add react-window or similar for list virtualization

## Fragile Areas

### Auth Provider Initialization
- **Files:** `src/lib/auth.tsx` (lines 49-65)
- **Why fragile:** Relies on `auth` being initialized, but `auth` can be undefined if Firebase config missing
- **Safe modification:** Already has null check, but could improve error handling
- **Test coverage:** None detected - auth flow needs test coverage

### Landing Page Redirect Logic
- **Files:** `src/app/page.tsx` (lines 13-15)
- **Why fragile:** Uses useEffect with router.replace - can cause flash of content
- **Safe modification:** Use middleware for authenticated route protection instead

### Dashboard Layout Auth Check
- **Files:** `src/app/(dashboard)/layout.tsx` (line 28)
- **Why fragile:** Returns null briefly during auth check - can cause layout shift
- **Safe modification:** Show consistent loading state during auth check

## Dependencies at Risk

### Firebase v12.10.0
- **Risk:** Older version with potential security vulnerabilities
- **Impact:** Auth functionality depends on it
- **Migration plan:** Update to latest Firebase version when stable

### Next.js 16.1.6
- **Risk:** Very new version (released 2026), may have undiscovered issues
- **Impact:** Core framework
- **Migration plan:** Monitor for updates, test thoroughly before production

### React 19.2.3
- **Risk:** React 19 is relatively new, some libraries may have compatibility issues
- **Impact:** UI framework
- **Migration plan:** Ensure all UI component libraries support React 19

## Test Coverage Gaps

### No Test Files Detected
- **What's not tested:** None - no test files found in project
- **Files:** Entire codebase
- **Risk:** No regression detection, no confidence in refactoring
- **Priority:** High

### Auth Flow Untested
- **What's not tested:** Authentication flow, protected routes, sign-in/sign-out
- **Risk:** Auth bugs won't be caught until production
- **Priority:** High

### Component Rendering Untested
- **What's not tested:** UI components render correctly, respond to props
- **Risk:** Breaking changes go undetected
- **Priority:** Medium

## Known Bugs

### Build Requires Firebase Credentials
- **Symptoms:** `next build` fails with Firebase auth error
- **Files:** `src/lib/auth.tsx`, `src/lib/firebase.ts`
- **Trigger:** Run build without valid Firebase env vars
- **Workaround:** Add valid Firebase config to `.env.local` before building

### TypeScript Errors in .next Directory
- **Symptoms:** Type errors in generated type files
- **Files:** `.next/types/validator.ts`
- **Trigger:** After running dev or build
- **Workaround:** These are generated files - fix by creating missing source pages

## Feature Gaps (from feature-gap.md)

### Essential Features Missing
- Incident Management System (SLA, priority, escalation)
- Advanced User Management & RBAC
- Comprehensive Records Management
- Advanced Reporting & Analytics
- Notification & Alerting System
- Workflow & Automation

**Priority:** These gaps represent the delta between current MVP and enterprise-grade platform

---

*Concerns audit: 2026-03-27*