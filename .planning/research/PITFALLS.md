# Pitfalls Research

**Domain:** Project Management Dashboard Enhancements (Analytics, Gantt Charts, Media Handling, Reporting)
**Researched:** 2026-03-27
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Chart Library Compatibility with Next.js App Router

**What goes wrong:**
Charts fail to render or throw hydration errors when using Recharts, Victory, or other React-charting libraries with Next.js App Router. Components render on the server but fail to serialize client-side state, causing "Text content does not match server-rendered HTML" errors.

**Why it happens:**
Many chart libraries were built for client-side React and assume browser-only execution. Next.js App Router's server components and SSR behavior conflict with libraries that mutate DOM directly or use browser APIs during render.

**How to avoid:**
- Use `'use client'` directive for all chart components
- Choose libraries with explicit Next.js support (Recharts has partial support with workarounds)
- Wrap charts in client-side only components using dynamic imports with `ssr: false`
- Test chart components in isolation before integration

**Warning signs:**
- Hydration errors in console during development
- Charts render in development but fail in production build
- "Window is not defined" errors

**Phase to address:**
Analytics Phase — implement charts after verifying library compatibility

---

### Pitfall 2: Gantt Chart Library Bloat and SSR Incompatibility

**What goes wrong:**
Adding a full-featured Gantt library (DHTMLX, Bryntum, highcharts-gantt) adds 500KB+ to bundle size and creates severe SSR conflicts. These libraries expect full browser environment and break during Next.js server renders.

**Why it happens:**
Enterprise Gantt libraries are designed for full SPA deployments, not modern SSR frameworks. They mutate DOM extensively and load configuration from global scope, causing server-side crashes.

**How to avoid:**
- For simple timelines: build custom with CSS Grid/Flexbox (lightweight, full control)
- For complex Gantt: use lightweight alternatives like `@dHTMLX/trial-complex` with client-only wrappers OR evaluate `gantt-task-react` which has better React integration
- Implement lazy loading for Gantt component
- Consider virtualization for large task lists

**Warning signs:**
- Bundle size jumps >500KB after Gantt library install
- Server crash on page load containing Gantt
- Gantt renders blank on initial load then populates (flash of unstyled content)

**Phase to address:**
Timeline/Gantt Phase — start with custom implementation or lightweight library before enterprise solutions

---

### Pitfall 3: Unoptimized Media Uploads Blocking Client

**What goes wrong:**
Large file uploads freeze the UI because uploads run on the main thread without progress feedback. Users see no indication of upload status, leading to duplicate submissions and frustration.

**Why it happens:**
Basic file input implementations read entire file into memory and upload synchronously. No chunking, no progress events, no cancellation support.

**How to avoid:**
- Use XMLHttpRequest (not Fetch) for upload progress events
- Implement chunked uploads for files >5MB
- Show real-time progress bars with percentage
- Add cancel button for in-progress uploads
- Generate client-side image previews before upload
- Compress images on client before upload (use browser-image-compression)

**Warning signs:**
- UI freezes during file upload
- No progress indicator visible
- Users clicking upload multiple times
- Large files taking >30 seconds with no feedback

**Phase to address:**
Media Management Phase — build upload component with progress tracking before connecting to storage

---

### Pitfall 4: Firebase Storage Costs from Uncontrolled Media

**What goes wrong:**
Users upload raw high-resolution images and videos that balloon Firebase Storage usage and bandwidth costs. No validation, no compression, no size limits = exponential cost growth.

**Why it happens:**
No file size restrictions, no format validation, no client-side compression. Every smartphone photo (5-20MB) gets stored at original resolution.

**How to avoid:**
- Set explicit file size limits (e.g., 10MB max for images, 100MB for videos)
- Enforce allowed file types (images: jpg, png, webp; documents: pdf, doc)
- Implement client-side compression before upload
- Generate thumbnails for image previews
- Implement lazy loading for media galleries
- Set up Firebase Storage lifecycle rules (auto-delete after X days if needed)

**Warning signs:**
- Storage usage growing faster than user count suggests
- Average file size >5MB (should be <500KB for images)
- No thumbnail generation (loading full-resolution images in lists)

**Phase to address:**
Media Management Phase — add validation and compression before enabling uploads

---

### Pitfall 5: PDF Report Generation Blocking Server

**What goes wrong:**
PDF generation runs on server route, blocking other requests. Large reports take 30+ seconds to generate, timing out client requests. Memory usage spikes cause server instability.

**Why it happens:**
Libraries like `pdfmake`, `jspdf`, or `react-pdf` run synchronously on Node.js. When generating complex reports with many pages, they block the event loop and consume excessive memory.

**How to avoid:**
- Generate PDFs client-side using `jspdf` or `react-pdf` (moves load to user's device)
- For server-side generation: implement streaming response with proper timeouts
- Add report generation queue (background job) for complex reports
- Cache generated PDFs when data hasn't changed
- Implement pagination limits in PDF generation

**Warning signs:**
- API routes timeout during report generation
- Memory usage spikes on server during report exports
- Users reporting "stuck" loading states on export button

**Phase to address:**
Reporting Phase — implement client-side PDF generation or queue system from start

---

### Pitfall 6: Chart Data Over-Fetching and Re-Fetching

**What goes wrong:**
Dashboard fetches all raw data for charts, then re-fetches on every filter change. No caching, no aggregation, no pagination. Performance degrades as data grows.

**Why it happens:**
Treating chart data like regular API data. No distinction between raw data (for tables) and aggregated data (for visualizations). No React Query or SWR caching configured.

**How to avoid:**
- Create separate API endpoints for chart data (aggregated, filtered)
- Implement client-side caching with stale-while-revalidate
- Add debouncing for filter inputs (wait 300ms before refetching)
- Use virtualization for large datasets in tables feeding charts
- Consider pre-aggregating data in Firebase Cloud Functions

**Warning signs:**
- Chart load time >2 seconds
- API calls spike on every filter interaction
- No loading skeleton while chart loads
- Memory issues when charting >1000 data points

**Phase to address:**
Analytics Phase — design chart data APIs separately from regular CRUD endpoints

---

### Pitfall 7: Timeline/Gantt Zoom Levels Not Matching Business Needs

**What goes wrong:**
Gantt chart only shows one time scale (e.g., months) but users need day-level for sprint planning and quarter-level for roadmapping. Wrong zoom = chart becomes unusable.

**Why it happens:**
Default Gantt implementation uses single time scale. No consideration for different planning horizons. Underestimating need for multiple zoom levels.

**How to avoid:**
- Implement at minimum: day, week, month zoom levels
- Add quick-switch buttons for zoom levels
- Auto-zoom based on project date range
- Ensure labels and bars resize appropriately per zoom
- Test with realistic project durations (1 week to 12 months)

**Warning signs:**
- Users complain about "can't see details" or "too zoomed in"
- Single timeline view for all projects
- Task bars overlap or become invisible at certain zoom levels

**Phase to address:**
Timeline/Gantt Phase — implement zoom levels as core requirement, not afterthought

---

### Pitfall 8: Export Formats Without User Choice

**What goes wrong:**
Report exports only available in one format (usually PDF). Users need CSV for Excel analysis, PDF for sharing, JSON for data integration. Limiting format = limited utility.

**Why it happens:**
Implementing single export format is easier. Adding multiple formats requires different handling, more testing, more code paths. Often overlooked until users complain.

**How to avoid:**
- Support minimum: PDF, CSV, Excel (XLSX)
- CSV for data-heavy reports (tasks, users)
- PDF for formatted reports (executive summaries)
- Excel for detailed data with multiple sheets
- Use libraries: `xlsx` for Excel, `jspdf` for PDF, native `Blob` for CSV

**Warning signs:**
- Only one export format available
- Users requesting "can I get this as CSV?"
- Export button has no format selector dropdown

**Phase to address:**
Reporting Phase — design export system with multiple format support from start

---

### Pitfall 9: No Error Handling for Failed Uploads or Exports

**What goes wrong:**
Failed uploads show no error message, failed exports crash silently, network errors leave UI in inconsistent state. Users don't know what happened or what to do.

**Why it happens:**
Success path only coding. No toast notifications, no retry options, no error boundaries around chart/export components.

**How to avoid:**
- Wrap all async operations in try-catch with user feedback
- Implement toast notifications for success/error states
- Add retry button for failed operations
- Implement exponential backoff for retry attempts
- Show clear error messages, not just "Something went wrong"
- Add error boundaries around charts and exports

**Warning signs:**
- No toast system in current UI stack
- Console errors visible but no UI feedback
- Users reporting "I clicked export but nothing happened"

**Phase to address:**
All phases — add error handling infrastructure (toast system, error boundaries) early

---

### Pitfall 10: Firebase Realtime Listeners Causing Performance Issues

**What goes wrong:**
Adding realtime listeners to Firestore/Realtime Database for dashboard updates causes cascading performance issues. Too many listeners, no cleanup, memory leaks on component unmount.

**Why it happens:**
Attaching listeners without cleanup, subscribing to collections that grow indefinitely, not batching updates. Firebase realtime is powerful but easy to misuse.

**How to avoid:**
- Always cleanup listeners in useEffect cleanup function
- Limit queries with where clauses (don't subscribe to entire collection)
- Use snapshots for real-time, getDocs for one-time fetches
- Implement debounced updates for chart data from realtime listeners
- Set up compound queries for filtered subscriptions

**Warning signs:**
- Multiple database listeners active simultaneously
- Memory usage grows over time
- Dashboard feels sluggish after extended use
- Console warnings about listener leaks on unmount

**Phase to address:**
Analytics Phase — implement proper listener management and cleanup patterns

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using client-side only charts without wrapper | Quick to implement | Breaks production, hydration errors | Never — always use proper client directive |
| Skipping file size validation | Saves dev time | Storage cost explosion, UX issues | Never |
| Single export format | Faster initial build | User complaints, rework needed | Only for MVP quick release |
| No loading states for charts | Avoids extra UI work | Poor perceived performance | Never |
| Realtime listeners without limits | Real-time feels impressive | Performance degradation | Only with proper query limits |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Firebase Storage | Not setting CORS rules | Configure storage CORS via `gsutil cors set` |
| Firebase Auth | Not handling auth state race conditions | Use auth state listener with loading state |
| Chart libraries | Not using dynamic import with ssr:false | `const Chart = dynamic(() => import('./Chart'), { ssr: false })` |
| PDF generation | Running on server route handler | Move to client-side or use background queue |
| Gantt library | Importing in server component | Lazy load with client-only boundary |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Chart with >5000 data points | UI freeze, memory spike | Implement data sampling, aggregation | At scale (>1000 tasks) |
| Realtime listener on full collection | Slow initial load, bandwidth | Add query limits, where clauses | When collection >100 documents |
| Exporting all data at once | Timeout, memory spike | Paginate exports, use streaming | When exporting >1000 rows |
| Full-resolution image gallery | Slow page load, bandwidth | Generate thumbnails, lazy load | When gallery >20 images |
| Gantt with unlimited tasks | DOM bloat, scroll lag | Virtualization, pagination | When >500 tasks visible |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| File upload without type validation | Malware upload, XSS | Validate MIME type server-side, check file headers |
| Allowing any file extension | Executable files in storage | Whitelist allowed extensions only |
| Report access without permission | Data leakage | Verify auth context before generating any report |
| Client-side PDF with sensitive data | Data exposure in browser | Consider server-side generation for sensitive reports |
| Public storage bucket | Data leak to internet | Enforce Firebase security rules, default deny |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress on upload | Users think it's stuck, resubmit | Always show progress bar with percentage |
| Charts with no empty states | Shows blank space, confusing | Add "No data available" placeholder |
| Export with no feedback | User thinks nothing happened | Show toast on start, success, and error |
| Filter without clear indicators | Users don't know what's filtered | Show active filter chips with clear button |
| Gantt with no task details | Can't see who/what without clicking | Hover cards or click-to-expand details |

---

## "Looks Done But Isn't" Checklist

- [ ] **Charts:** Have loading skeleton? Test with slow network
- [ ] **Charts:** Handle empty data gracefully? Shows meaningful message
- [ ] **Gantt:** Zoom levels working? Day/week/month all functional
- [ ] **Gantt:** Task details on hover/click? Users can see assignees, dates
- [ ] **Media:** File size limits enforced? Try uploading 50MB file
- [ ] **Media:** Progress bar visible? Upload 10MB file and watch
- [ ] **Media:** Error on failed upload? Disconnect network and try
- [ ] **Reports:** Format selector available? PDF/CSV/Excel options
- [ ] **Reports:** Timeout handling? Generate large report (100+ pages)
- [ ] **Reports:** Download starts automatically? Check network tab
- [ ] **General:** Error states visible? Trigger error and verify feedback
- [ ] **General:** Auth required for exports? Try exporting without login

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Chart hydration errors | MEDIUM | Wrap in dynamic import, add 'use client' |
| Gantt SSR crash | MEDIUM | Lazy load component, add client boundary |
| Storage cost explosion | HIGH | Delete oversized files, implement compression, set limits |
| PDF timeout | LOW | Move to client-side generation, add timeout handling |
| Realtime listener leak | MEDIUM | Add cleanup in useEffect, verify with React DevTools |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Chart library compatibility | Analytics Phase | Test charts in production build |
| Gantt library bloat | Timeline Phase | Measure bundle size, test SSR |
| Unoptimized uploads | Media Phase | Upload 20MB file, verify progress |
| Storage cost issues | Media Phase | Check average file size in storage |
| PDF blocking server | Reporting Phase | Generate 50-page report, verify timeout |
| Chart over-fetching | Analytics Phase | Test with 1000+ data points |
| Timeline zoom levels | Timeline Phase | Test all zoom levels with real projects |
| Export format limits | Reporting Phase | Verify all format options work |
| No error handling | All Phases | Trigger errors and verify feedback |
| Firebase listener issues | Analytics Phase | Check React DevTools for leaks |

---

## Sources

- Next.js Chart.js/Recharts SSR compatibility issues — community discussions on Next.js GitHub
- DHTMLX and Bryntum Gantt Next.js integration — official integration docs
- React file upload best practices — Medium articles on production patterns
- Firebase Storage security and costs — Firebase documentation
- Dashboard performance patterns — BootstrapDash, DeveloperWay articles
- React Admin Dashboard mistakes — Dev.to community post

---

*Pitfalls research for: Project Management Dashboard Enhancements*
*Researched: 2026-03-27*
