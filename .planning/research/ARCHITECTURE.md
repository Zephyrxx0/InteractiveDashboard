# Architecture Research

**Domain:** Project Management Dashboard (Analytics, Task Management, Media, Reporting)
**Researched:** 2026-03-27
**Confidence:** MEDIUM

## Executive Summary

This architecture research examines how analytics, task management (Gantt), media management, and reporting features integrate with the existing Next.js dashboard codebase. The current architecture uses Next.js 16 App Router with route groups, Firebase authentication, and Radix UI components. New features should follow a similar pattern: modular feature components, client-side data fetching with Firebase, and reusable UI primitives.

The recommended approach uses TanStack Query for analytics data management, dedicated Gantt/timeline components for task visualization, cloud storage integration (S3/R2) for media, and server-side PDF generation for reporting. Each feature domain has clear integration points with the existing AppShell layout and Firebase backend.

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │  Analytics  │  │   Gantt     │  │    Media    │  │Reports  │ │
│  │  Dashboard │  │   Chart     │  │   Manager   │  │ Viewer  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │
│         │                │                │               │      │
├─────────┴────────────────┴────────────────┴───────────────┴──────┤
│                    Component Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Feature Components (src/components/features/)     │ │
│  │  analytics/    tasks/          media/         reports/       │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    UI Primitive Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │         UI Components (src/components/ui/)                  │ │
│  │   button, dialog, dropdown, card, chart-wrappers            │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Application Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   AppShell   │  │ AuthProvider │  │  Route Group │            │
│  │  (layout)    │  │  (context)  │  │  Handlers    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│                    Service Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Firebase     │  │ TanStack     │  │ Storage API  │            │
│  │ Firestore    │  │ Query        │  │ (S3/R2)     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Analytics Dashboard | KPI aggregation, chart rendering, time-range filtering | TanStack Query + Recharts/Tremor + date pickers |
| Gantt Chart | Timeline visualization, task dependencies, drag-drop scheduling | DHTMLX/SVAR or custom SVG + task store |
| Media Manager | File upload, thumbnail generation, folder organization | UploadThing/S3 + grid/list views |
| Reports Viewer | PDF generation, export formatting, template selection | React-PDF/@formepdf + server actions |

## Recommended Project Structure

```
src/
├── components/
│   ├── features/
│   │   ├── analytics/
│   │   │   ├── analytics-dashboard.tsx    # Main analytics page
│   │   │   ├── kpi-grid.tsx                # KPI card layout
│   │   │   ├── chart-wrapper.tsx           # Recharts integration
│   │   │   └── date-range-picker.tsx       # Filter controls
│   │   ├── tasks/
│   │   │   ├── gantt-view.tsx              # Gantt timeline component
│   │   │   ├── task-list.tsx               # List view (existing)
│   │   │   ├── gantt-bar.tsx               # Task bar in timeline
│   │   │   └── task-dependencies.tsx        # Dependency lines
│   │   ├── media/
│   │   │   ├── media-library.tsx            # File grid/list view
│   │   │   ├── file-uploader.tsx            # Dropzone upload
│   │   │   ├── media-modal.tsx              # Preview/details
│   │   │   └── folder-tree.tsx              # Folder navigation
│   │   └── reports/
│   │       ├── reports-dashboard.tsx        # Reports list page
│   │       ├── report-preview.tsx            # PDF viewer
│   │       ├── export-dialog.tsx             # Format selection
│   │       └── report-templates.tsx         # Template picker
│   └── ui/
│       ├── charts/                          # Reusable chart components
│       │   ├── bar-chart.tsx
│   │   │   ├── line-chart.tsx
│   │   │   └── pie-chart.tsx
│       └── dialog.tsx                       # Existing (Radix-based)
├── lib/
│   ├── firebase/
│   │   ├── firestore.ts                      # Query helpers
│   │   └── storage.ts                       # Storage refs
│   ├── analytics/
│   │   └── metrics.ts                       # KPI calculations
│   └── reports/
│       └── pdf-generator.ts                # PDF creation logic
├── hooks/
│   ├── use-analytics.ts                     # Analytics data fetching
│   ├── use-tasks.ts                         # Task CRUD operations
│   ├── use-media.ts                         # Media operations
│   └── use-reports.ts                       # Report generation
└── app/
    └── (dashboard)/
        ├── analytics/
        │   └── page.tsx
        ├── tasks/
        │   ├── page.tsx                     # List + Gantt toggle
        │   └── gantt/
        │       └── page.tsx                 # Full Gantt view
        ├── media/
        │   └── page.tsx
        └── reports/
            └── page.tsx
```

### Structure Rationale

- **features/ subdirectories:** Each major feature domain gets its own folder within features/, containing all related components, making it easy to locate and modify. This matches the existing `features/` pattern in the codebase.

- **UI chart components:** Dedicated `components/ui/charts/` folder centralizes chart wrapper components, ensuring consistent styling across analytics views. Prevents duplication of Recharts configuration.

- **lib feature folders:** Analytics and reports utilities live in `lib/` to keep business logic separate from presentation. Reusable across components.

- **hooks co-located with features:** Feature-specific hooks live in `hooks/` rather than scattered, making it clear what data operations each feature supports.

- **Gantt under tasks/:** Gantt view is part of the tasks feature, not a top-level route. Shares task data and state with task list view.

## Architectural Patterns

### Pattern 1: TanStack Query + Firebase for Analytics

**What:** Data fetching pattern that caches analytics queries and syncs with Firebase Firestore.

**When to use:** Analytics dashboards with multiple charts requiring real-time or cached data, time-range filtering, and drill-down capabilities.

**Trade-offs:**

- Pros: Automatic caching, background refetching, loading states, optimistic updates
- Cons: Additional library, client-side only (Firestore limitations), potential over-fetching

**Example:**
```typescript
// hooks/use-project-metrics.ts
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useProjectMetrics(projectId: string, dateRange: DateRange) {
  return useQuery({
    queryKey: ['project-metrics', projectId, dateRange],
    queryFn: async () => {
      const q = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId),
        where('createdAt', '>=', dateRange.start),
        where('createdAt', '<=', dateRange.end)
      );
      const snapshot = await getDocs(q);
      return aggregateMetrics(snapshot.docs);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Pattern 2: Gantt Timeline with Task Store

**What:** Centralized task state that drives both list view and Gantt visualization, with dependency tracking.

**When to use:** Project management requiring task scheduling, timeline visualization, and dependency management.

**Trade-offs:**

- Pros: Single source of truth, consistent updates across views, enables drag-drop scheduling
- Cons: Complex state management, dependency calculation overhead, library weight

**Example:**
```typescript
// lib/tasks/task-store.ts (Zustand or Context)
interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  setTasks: (tasks: Task[]) => void;
  updateTaskDates: (taskId: string, start: Date, end: Date) => void;
  getDependencies: (taskId: string) => Task[];
}

// components/features/tasks/gantt-view.tsx
export function GanttView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="gantt-timeline">
      {tasks.map(task => (
        <GanttBar
          key={task.id}
          task={task}
          onDragEnd={(start, end) => updateTaskDates(task.id, start, end)}
        />
      ))}
    </div>
  );
}
```

### Pattern 3: Cloud Storage Integration for Media

**What:** Upload component that streams files directly to cloud storage (S3/R2/UploadThing) with progress tracking.

**When to use:** Media management requiring file uploads, thumbnails, folder organization, and preview capabilities.

**Trade-offs:**

- Pros: Offloads bandwidth from server, scalable storage, CDN delivery
- Cons: Third-party dependency, configuration complexity, potential cost

**Example:**
```typescript
// components/features/media/file-uploader.tsx
'use client';
import { useUploadThing } from '@/lib/uploadthing';

export function FileUploader({ folderId, onUploadComplete }) {
  const { startUpload, uploadProgress } = useUploadThing('mediaUploader', {
    onClientUploadComplete: (files) => {
      onUploadComplete(files.map(f => f.serverData));
    },
  });

  return (
    <div className="dropzone">
      <input
        type="file"
        multiple
        onChange={(e) => startUpload(e.target.files)}
      />
      {uploadProgress > 0 && <Progress value={uploadProgress} />}
    </div>
  );
}
```

### Pattern 4: Server-Side PDF Generation

**What:** Report generation using Next.js Server Actions or Route Handlers to create PDFs server-side, then stream to client.

**When to use:** Report generation requiring consistent formatting, large PDFs, or server-side data aggregation.

**Trade-offs:**

- Pros: Consistent rendering, no client bloat, can use database/server resources
- Cons: Server load, generation latency, template complexity

**Example:**
```typescript
// app/api/reports/generate/route.ts
import { NextResponse } from 'next/server';
import { pdf } from '@formepdf/next';
import { ReportTemplate } from '@/components/reports/template';

export async function POST(request: Request) {
  const data = await request.json();
  const buffer = await pdf(<ReportTemplate data={data} />);
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${data.id}.pdf"`,
    },
  });
}
```

## Data Flow

### Request Flow: Analytics Dashboard

```
[User visits /analytics]
    ↓
[Page component loads]
    ↓
[useQuery hook fetches data]
    ↓
[Firestore query executes]
    ↓
[Data aggregates into metrics]
    ↓
[Components render charts with data]
    ↓
[User interacts with date filter]
    ↓
[Query key changes → refetch]
    ↓
[Charts animate to new data]
```

### Request Flow: Gantt Task Management

```
[User navigates to /tasks/gantt]
    ↓
[TaskStore loads tasks from Firestore]
    ↓
[GanttView renders task bars]
    ↓
[User drags task bar to new dates]
    ↓
[onDragEnd updates local state]
    ↓
[Firestore batch update]
    ↓
[Dependencies recalculate]
    ↓
[Related task bars reposition]
```

### Request Flow: Media Upload

```
[User selects files]
    ↓
[FileUploader calls useUploadThing startUpload]
    ↓
[Files upload to cloud storage (S3/R2)]
    ↓
[UploadThing webhook fires → Firestore record created]
    ↓
[Media library refetches]
    ↓
[New files appear in grid]
```

### Request Flow: Report Generation

```
[User clicks "Generate Report"]
    ↓
[ExportDialog collects options (date range, format)]
    ↓
[Server Action or API route called]
    ↓
[Server aggregates data from Firestore]
    ↓
[PDF generated with template]
    ↓
[Browser downloads file]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 users | Single Firestore instance, client-side aggregation, basic caching. Gantt library loads all tasks in memory. |
| 100-1k users | Firestore indexes for queries, TanStack Query with staleTime, paginated task loading. Consider virtualized Gantt for 500+ tasks. |
| 1k-10k users | Firestore sharding consideration, background data aggregation (cloud functions), CDN for media. Gantt requires virtualization and server-side date range fetching. |
| 10k+ users | Analytics pre-aggregation (materialized views), separate analytics database, media CDN with CloudFront. Gantt becomes read-only with server-side rendering. |

### Scaling Priorities

1. **First bottleneck: Firestore query costs.** Analytics aggregations hit Firestore on every page load.
   - Fix: Pre-aggregate metrics in Cloud Functions, cache in Redis or Firebase Cache.

2. **Second bottleneck: Gantt performance.** Large task sets slow down the timeline.
   - Fix: Virtual scrolling, lazy load visible date ranges only, disable animations.

3. **Third bottleneck: Media bandwidth.** Large file uploads consume server bandwidth.
   - Fix: Use direct-to-cloud uploads (UploadThing, S3 presigned URLs), implement CDN.

## Anti-Patterns

### Anti-Pattern 1: Embedding Analytics Logic in Page Components

**What people do:** Putting Firestore queries, aggregation logic, and chart rendering all in the page component.

**Why it's wrong:** Logic becomes untestable, hard to reuse, and bloats the page. Changing chart libraries requires rewriting business logic.

**Do this instead:** Create dedicated hooks (`useProjectMetrics`) and chart wrapper components. Page becomes simple composition.

```typescript
// Bad: Everything in page
export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    // query, aggregate, set state all here
  }, []);
  return <Chart data={data} />; // tightly coupled
}

// Good: Separation of concerns
export default function AnalyticsPage() {
  const { metrics, isLoading } = useProjectMetrics(projectId);
  return <ChartWrapper data={metrics} isLoading={isLoading} />;
}
```

### Anti-Pattern 2: Client-Side PDF Generation

**What people do:** Using client-side libraries like jsPDF to generate reports in the browser.

**Why it's wrong:** Large PDFs freeze the browser, fonts render inconsistently, and sensitive data passes through client.

**Do this instead:** Use server-side generation (React-PDF @formepdf/next, DocuForge) or third-party APIs. Send only IDs/options from client.

### Anti-Pattern 3: Gantt Without Virtualization

**What people do:** Rendering all tasks as DOM elements, even when only 20 are visible.

**Why it's wrong:** Page becomes unresponsive with 100+ tasks. Memory usage grows unbounded.

**Do this instead:** Use libraries with built-in virtualization (dhtmlxGantt with virtual scrolling) or implement windowing.

### Anti-Pattern 4: Storing Files Directly in Firestore

**What people do:** Storing file data (base64 or binary) directly in Firestore documents.

**Why it's wrong:** Firestore has 1MB document limit, reads become expensive, network latency high.

**Do this instead:** Store files in cloud storage (S3, R2, UploadThing) and reference URLs in Firestore.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Firebase Firestore | Direct SDK calls via lib/firebase | Existing pattern, supports real-time listeners |
| UploadThing | useUploadThing hook | Simplifies S3 uploads, handles webhooks |
| Cloudflare R2 | Presigned URLs + SDK | Lower egress costs, S3-compatible |
| S3 | AWS SDK v3 + presigned URLs | Most common, full feature set |
| Recharts | Chart wrapper components | Most popular free React charting |
| Tremor | Block + Chart components | Built on Recharts, dashboard-optimized |
| DHTMLX Gantt | React wrapper component | Full-featured, paid license for React |
| SVAR React Gantt | React component | Lighter weight, MIT license |
| React-PDF | Server-side generation | Client rendering possible but not recommended |
| @formepdf/next | Route handler + React component | Next.js native, uses React-PDF under hood |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Analytics ↔ Firestore | useQuery hooks | Query logic lives in hooks, not components |
| Gantt ↔ Tasks | Shared TaskStore | Single source of truth, Zustand or Context |
| Media ↔ Storage | UploadThing + Firestore | Storage URL stored in Firestore doc |
| Reports ↔ Analytics | Server Action | Aggregates data server-side, returns PDF stream |
| AppShell ↔ Features | Props + children | AppShell provides layout, features provide content |

## Build Order

Given the feature dependencies, the recommended build order is:

1. **Analytics Base** (Foundation)
   - Create `use-analytics` hooks for Firestore queries
   - Build KPI aggregation utilities in `lib/analytics`
   - Add chart wrapper components in `components/ui/charts`
   - Rationale: Other features (reports) depend on analytics data

2. **Task Management Enhancement** (Uses Analytics)
   - Integrate Gantt library with existing task list
   - Create task store for shared state
   - Add drag-drop updates with Firestore batch writes
   - Rationale: Already has task list, Gantt is enhancement

3. **Media Management** (Independent but foundational)
   - Set up UploadThing or S3 integration
   - Build file uploader with progress
   - Create media library grid view
   - Rationale: Independent feature, reports may include media

4. **Reports Generation** (Consumer of others)
   - Build PDF templates using React-PDF
   - Create server-side generation route
   - Add export dialog UI
   - Rationale: Depends on analytics data and media library

## Sources

- [Next.js SaaS Dashboard Development: Scalability & Best Practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards) — KSolves, December 2025
- [Building a Gantt Chart in Next.js with SVAR React Gantt](https://svar.dev/blog/nextjs-gantt-chart-tutorial/) — SVAR Blog, February 2026
- [DHTMLX React Gantt with Next.js](https://dhtmlx.com/blog/why-use-dhtmlx-gantt-for-react-with-next-js-in-project-management-apps/) — DHTMLX, January 2026
- [File Uploads, Images & Media Handling in Next.js](https://medium.com/@chandansingh73718/file-uploads-images-media-handling-in-next-js-production-ready-patterns-914c6456620) — Chandan, January 2026
- [How to Generate PDFs in Next.js with DocuForge](https://getdocuforge.dev/blog/generate-pdfs-nextjs-docuforge) — DocuForge, March 2026
- [Designing a Clean and Scalable Next.js Project Structure](https://medium.com/@christian.asterisk/designing-a-clean-and-scalable-next-js-project-structure-3dff4518aadb) — Christian, February 2026
- [7 Best Next.js 16 Admin Dashboards With shadcn/ui (2026)](https://adminlte.io/blog/nextjs-admin-dashboards-shadcn/) — AdminLTE, March 2026

---

*Architecture research for: Interactive Dashboard*
*Researched: 2026-03-27*
