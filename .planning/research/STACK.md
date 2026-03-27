# Technology Stack — Analytics, Task Management, Media & Reporting

**Project:** Interactive Dashboard Enhancement  
**Researched:** 2026-03-27  
**Confidence:** HIGH

## Executive Summary

This stack extends the existing Next.js 16.1.6 + React 19 + Tailwind CSS v4 foundation with focused libraries for analytics charts, task timeline visualization, media handling, and PDF report generation.

| Enhancement Area | Recommended | Version | Why |
|------------------|-------------|---------|-----|
| Charts/Analytics | **Recharts** | 3.8.x | 22M weekly downloads, declarative JSX, TypeScript native |
| Task Timeline | **dhtmlx-gantt** | Latest | Mature Gantt implementation, React adapter |
| Media Upload | **react-dropzone** | Latest | 5M downloads, headless, pairs with Firebase Storage |
| PDF Reports | **@react-pdf/renderer** | Latest | 2.2M downloads, React component-based API |

---

## Analytics & Charts

### Recommended: Recharts v3

| Aspect | Details |
|--------|---------|
| **Version** | 3.8.x (latest: 3.8.1, published March 2026) |
| **Downloads** | 22.2M weekly — most popular React charting library |
| **API Style** | Declarative JSX components |
| **TypeScript** | Native support with generics (v3.8.0 added data validation) |
| **Rendering** | SVG-based, responsive |

**Why Recharts over alternatives:**

- **vs Tremor**: Tremor is now integrated into shadcn/ui ecosystem but offers fewer chart types. Recharts has broader chart coverage (Area, Bar, Line, Pie, Radar, Scatter, Funnel, Treemap, etc.) and more customization. Tremor's advantage is out-of-the-box dashboard styling, but Recharts integrates better with custom UI.
- **vs Nivo**: Nivo offers more chart types and better animations, but larger bundle size (~3x). Recharts provides 80% of use cases with 20% of the weight.
- **vs Victory**: Victory is powerful but has a steeper learning curve and less React-idiomatic API. Recharts uses familiar JSX patterns.
- **vs Chart.js**: Chart.js is vanilla-JS focused; react-chartjs-2 adds React wrapper but feels less "React-native" than Recharts.

**Install:**
```bash
npm install recharts
```

**Example:**
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

---

## Task Timeline & Gantt Charts

### Recommended: dhtmlx-gantt

| Aspect | Details |
|--------|---------|
| **Library** | dhtmlx-gantt (with @xhorsky/react-gantt-schedule-timeline-calendar adapter) |
| **Alternative** | gantt-schedule-timeline-calendar (open source, v3.41.x) |
| **Complexity** | Medium — requires wrapper for React integration |

**Why dhtmlx-gantt:**

- **Mature**: 15+ years of development, battle-tested in enterprise
- **Features**: Full Gantt with dependencies, critical path, drag-drop, zoom levels
- **React Support**: @xhorsky/react-gantt-schedule-timeline-calendar provides React wrapper
- **Performance**: Handles 10,000+ tasks without lag

**Alternative for simpler needs:**

If full Gantt is overkill, consider:
- **react-calendar-timeline** — lighter weight, good for project timelines
- **Custom implementation** using Recharts with custom rendering for simpler甘特-style views

**Install:**
```bash
npm install gantt-schedule-timeline-calendar
# or for enterprise features:
npm install dhtmlx-gantt
```

**NOT recommended:**
- **Bryntum** — fastest but expensive commercial license
- **react-timeline-gantt** — unmaintained (last update 2018)
- Custom canvas-based implementations — reinventing the wheel

---

## Media Handling & File Upload

### Recommended: react-dropzone + Firebase Storage

| Component | Library | Purpose |
|-----------|---------|---------|
| UI | react-dropzone | Drag-and-drop file zone, validation |
| Storage | Firebase Storage (existing) | File storage backend |
| Preview | Native browser APIs | Image preview generation |

**Why react-dropzone:**

- **5M weekly downloads** — de facto standard for file drop zones
- **Headless** — full control over UI, integrates with Tailwind/Radix
- **Lightweight** — ~15KB gzipped
- **Features**: File validation, multiple files, drag-drop, progress tracking

**vs alternatives:**

- **Uppy**: More features (cloud import, webcam) but larger bundle (~70KB). Use only if multi-source uploads needed (Google Drive, Dropbox, etc.)
- **FilePond**: Feature-rich but opinionated UI — hard to style consistently with existing Radix/Tailwind
- **react-images-uploading**: Too specific to image-only use cases

**Install:**
```bash
npm install react-dropzone
```

**Integration with Firebase Storage:**
```tsx
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const onDrop = async (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  const storageRef = ref(storage, `uploads/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  // Save URL to Firestore
};
```

---

## Report Generation & PDF Export

### Recommended: @react-pdf/renderer

| Aspect | Details |
|--------|---------|
| **Version** | 4.3.x (latest: 4.3.2, published Dec 2025) |
| **Downloads** | 2.2M weekly — most popular React PDF library |
| **API Style** | React component-based (Document, Page, View, Text, Image) |
| **Rendering** | Server and browser support |

**Why @react-pdf/renderer:**

- **Declarative**: Write PDFs using React components — familiar paradigm
- **TypeScript**: Full type definitions included
- **Flexibility**: Custom fonts, images, layouts
- **No server required**: Can generate in browser

**vs alternatives:**

- **pdfjs-dist**: PDF rendering (viewing), not generation
- **jsPDF**: Low-level imperative API — harder to maintain
- **pdfn**: Modern alternative (v1.1.x) but smaller ecosystem
- **@onedoc/react-print**: Newer, simpler API but less mature

**Install:**
```bash
npm install @react-pdf/renderer
```

**For charts in PDFs:**
```tsx
// Requires rendering chart as image first, then embedding
import { Document, Page, Image, View, Text } from '@react-pdf/renderer';

const ReportDocument = ({ chartBase64 }) => (
  <Document>
    <Page size="A4">
      <View>
        <Text>Project Report</Text>
        <Image src={chartBase64} />
      </View>
    </Page>
  </Document>
);
```

**Known limitation:** Recharts SVG doesn't render directly in @react-pdf. Solution: Convert chart to canvas/base64 first using html2canvas or react-dom/server.

---

## Additional Recommendations

### Data Fetching & State (if needed)

If analytics require complex data transformations:

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **TanStack Query** | Server state, caching, refetch | When analytics data comes from Firebase/Firestore |
| **Zustand** | Client state | For dashboard filters, date ranges shared across components |

**Install (if needed):**
```bash
npm install @tanstack/react-query zustand
```

### Date Utilities

Already in stack: `date-fns` (4.1.0). Continue using for:
- Date range formatting
- Relative time ("2 days ago")
- Calendar math

### Export Utilities

For CSV/Excel exports:

| Library | Purpose |
|---------|---------|
| **xlsx** | Excel file generation |
| **papaparse** | CSV parsing/generation |

```bash
npm install xlsx papaparse
```

---

## Stack Summary Table

| Category | Recommended | Version | Alternative | Why Not Alternative |
|----------|-------------|---------|-------------|---------------------|
| Charts | Recharts | 3.8.x | Tremor, Nivo | Tremor limited; Nivo heavy |
| Gantt | gantt-schedule-timeline-calendar | 3.41.x | dhtmlx-gantt, Bryntum | Open source; dhtmlx complex |
| File Upload | react-dropzone | latest | Uppy, FilePond | Headless, lightweight |
| PDF | @react-pdf/renderer | 4.3.x | jsPDF, pdfn | React-native API |
| State (opt) | TanStack Query | 5.x | SWR, Apollo | More flexible |
| Export | xlsx | latest | papaparse | Excel support |

---

## Installation

```bash
# Analytics & Charts
npm install recharts

# Task Timeline (optional - evaluate need first)
npm install gantt-schedule-timeline-calendar

# Media Handling
npm install react-dropzone

# PDF Reports
npm install @react-pdf/renderer

# Optional: Data utilities
npm install xlsx
```

---

## Sources

- Recharts: https://recharts.org/, NPM (22.2M weekly downloads)
- react-dropzone: https://react-dropzone.js.org/, NPM (5M weekly downloads)
- @react-pdf/renderer: https://react-pdf.org/, NPM (2.2M weekly downloads)
- gantt-schedule-timeline-calendar: https://github.com/neuronet/gantt-schedule-timeline-calendar
- PkgPulse React Charts 2026: https://www.pkgpulse.com/blog/recharts-v3-vs-tremor-vs-nivo-react-charting-2026
- PkgPulse File Upload 2026: https://www.pkgpulse.com/blog/best-file-upload-libraries-react-2026
- PkgPulse PDF Generation: https://apryse.com/blog/pdf-template-generation-libraries
