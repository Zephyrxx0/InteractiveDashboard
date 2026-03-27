# Testing Patterns

**Analysis Date:** 2026-03-27

## Test Framework

**Runner:**
- Not configured - No test framework currently installed
- `package.json` has no testing dependencies (no Jest, Vitest, or similar)

**Recommendation:**
- Install Vitest for React/Next.js testing (compatible with Vite)
- Add `@testing-library/react`, `@testing-library/jest-dom`

## Test File Organization

**Current State:**
- **No test files exist** in the project

**Expected Pattern (based on project structure):**
- Tests should be co-located with components: `src/components/ui/button.tsx` → `src/components/ui/button.test.tsx`
- Or in parallel `__tests__` directories

**Naming Convention:**
- `*.test.tsx`, `*.test.ts`, `*.spec.tsx`, `*.spec.ts`

## Test Structure

**Recommended Pattern:**
```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });
});
```

## Mocking

**Recommended Framework:** Jest or Vitest with MSW (Mock Service Worker)

**Mocking Patterns:**

**1. Firebase/Auth:**
```typescript
// __mocks__/lib/firebase.ts
export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
};
```

**2. Next.js Router:**
```typescript
// __mocks__/next/navigation.ts
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
}));
```

**3. Window MatchMedia:**
```typescript
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

**What to Mock:**
- Firebase auth and database
- Next.js navigation (`useRouter`, `usePathname`)
- External API calls via MSW
- Browser APIs (`matchMedia`, `localStorage`)

**What NOT to Mock:**
- React components (test rendered output)
- Utility functions like `cn()` (test behavior)
- Simple pure functions

## Fixtures and Factories

**Test Data Location:**
- Create `src/__fixtures__/` or `tests/fixtures/`
- JSON files for static data
- Factory functions for dynamic data

**Example Factory:**
```typescript
function createMockTask(overrides = {}): Task {
  return {
    id: "task-1",
    name: "Test Task",
    dueDate: "2024-01-15",
    completed: false,
    ...overrides,
  };
}
```

## Coverage

**Current State:**
- No coverage configuration exists
- No coverage reports generated

**Recommended Target:** 70-80% for components, 60% for utilities

**View Coverage (with Vitest):**
```bash
npm run test -- --coverage
```

## Test Types

**Unit Tests:**
- Priority: High
- Scope: Utility functions (`cn()`), hooks (`useIsMobile`), context providers (`AuthProvider`)

**Integration Tests:**
- Priority: Medium
- Scope: Component interactions, form submissions, auth flows

**E2E Tests:**
- Not currently configured
- Consider Playwright for critical user journeys if needed

## Critical Testing Gaps

**Immediate Needs:**
1. **Auth Context** - `useAuth` hook tests for auth state changes
2. **Utility Functions** - Test `cn()` class merging behavior
3. **UI Components** - Button variants, form inputs
4. **Hooks** - `useIsMobile` breakpoint testing

## Testing Setup Commands

```bash
# Install Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add to package.json scripts
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

**Vitest Config (vitest.config.ts):**
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Setup File (tests/setup.ts):**
```typescript
import "@testing-library/jest-dom/vitest";
```

---

*Testing analysis: 2026-03-27*
