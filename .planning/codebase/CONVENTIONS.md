# Coding Conventions

**Analysis Date:** 2026-03-27

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ProjectCard.tsx`, `TaskList.tsx`)
- Utilities: camelCase (e.g., `utils.ts`, `firebase.ts`)
- Hooks: camelCase with "use" prefix (e.g., `use-mobile.ts`)

**Functions:**
- camelCase for all functions
- Named exports for components and hooks
- Clear, descriptive names: `useAuth`, `useIsMobile`, `formatUser`

**Variables:**
- camelCase (e.g., `isMobile`, `firebaseUser`, `progressColor`)
- Interface names: PascalCase (e.g., `Task`, `ProjectCardProps`, `AuthContextType`)

**Types:**
- PascalCase for interfaces and types (e.g., `User`, `Task`, `AuthContextType`)
- Type annotations on function parameters and return values

## Code Style

**Formatting:**
- ESLint: `eslint-config-next` with TypeScript rules (`eslint.config.mjs`)
- No explicit Prettier configuration found
- 2-space indentation in code samples

**Linting:**
- Config: `eslint.config.mjs` using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- TypeScript strict mode enabled in `tsconfig.json`

**Import Organization:**
1. React imports (`React`, `createContext`, `useContext`)
2. Next.js imports (`Link`, `useRouter`)
3. Firebase/auth imports
4. Third-party library imports (Radix UI, class-variance-authority)
5. Internal imports (`@/lib/`, `@/components/`)

**Path Aliases:**
- `@/*` maps to `./src/*`

## Error Handling

**Patterns:**
- Throws descriptive errors: `throw new Error("useAuth must be used within AuthProvider")`
- Null checks: `if (!context) throw new Error(...)`
- Firebase initialization checks: `if (!auth) throw new Error("Firebase auth not initialized")`

**Context Usage:**
- Custom hooks throw errors when used outside provider: `throw new Error("useAuth must be used within AuthProvider")`

## Component Design

**Structure:**
- Props interfaces defined above component
- Destructured props in function signature
- Optional props with defaults via destructuring
- Variant components use `cva` from `class-variance-authority`

**Example Pattern:**
```typescript
interface ProjectCardProps {
    id: string;
    title: string;
    status: "active" | "warning" | "halted" | "planning";
    // ...
}

export function ProjectCard({
    id,
    title,
    className,
}: ProjectCardProps) {
    // Component implementation
}
```

**Radix UI Integration:**
- Uses `@radix-ui/react-slot` for polymorphic components (`asChild` prop)
- Data attributes: `data-slot`, `data-variant`, `data-size`

## "use client" Directive

- Required for client-side components (hooks, auth, interactivity)
- Placed at top of file before imports
- Used in: `auth.tsx`, `task-list.tsx`, `use-mobile.ts`

## Utility Patterns

**Class Merging:**
- Uses `cn()` from `lib/utils.ts` combining `clsx` and `tailwind-merge`

**Variant Props:**
- Uses CVA (class-variance-authority) for component variants
- Pattern: `buttonVariants({ variant, size, className })`

## Tailwind CSS Patterns

**Styling Approach:**
- Tailwind CSS v4 with `@tailwindcss/postcss`
- CSS variables for theming (colors, spacing)
- Custom fonts: `font-display`, `font-mono`

**Utility Classes:**
- Responsive classes: `sm:inline-block`, `md:flex`
- Conditional classes via `cn()`

---

*Convention analysis: 2026-03-27*
