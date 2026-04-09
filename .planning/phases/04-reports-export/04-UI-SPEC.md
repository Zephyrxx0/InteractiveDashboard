---
status: draft
---

# UI-SPEC: Phase 04 - Reports & Export

## 1. Spacing Contract
- **Scale Base:** 8-point system (4, 8, 16, 24, 32, 48, 64px).
- **Exceptions:** None for this phase.
- *Source: Default standard.*

## 2. Typography Contract
- **Font Sizes:** 14px (sm), 16px (base), 20px (lg), 28px (2xl).
- **Font Weights:** 400 (regular), 600 (semibold).
- **Line Heights:** 1.5 (body), 1.2 (headings).
- *Source: Default standard.*

## 3. Color Contract
- **Dominant (60%):** Background/Surface colors (var(--background)).
- **Secondary (30%):** Cards, dialog backgrounds, muted elements.
- **Accent (10%):** Primary brand color (var(--primary)) for CTA buttons (e.g., "Export").
- **Destructive:** Not applicable in this phase.
- *Source: Existing default.css and dark.css theme files / Phase Context.*

## 4. Copywriting Contract
- **Primary CTA Label:** "Export Report" (for dialog triggers), "Download CSV", "Download PDF".
- **Empty State Copy:** "There are no reports to export for these dates."
- **Error State Copy:** "Failed to generate export. Check your connection or try selecting a smaller date range."
- **Destructive Actions:** None in this phase.
- *Source: 04-CONTEXT.md and sensible defaults.*

## 5. UI Elements & Interaction
- **Triggers:** Dialog-based trigger for format selection and date range options.
- **Form Layout:** Clean form inside a Dialog to select format (CSV/PDF), report template (Summary/Detailed), and date range (reusing DateRangePicker).
- **PDF Styling:** Clean/minimal approach, professional, follows dashboard theme (Header, summary stats, task table).
- **Visual Hierarchy & Focal Point:** The primary focal point is the report format selection options (CSV vs PDF), followed by the date range selector and the primary "Export" CTA.
- *Source: 04-CONTEXT.md.*

## 6. Registry & Components
- **System:** shadcn/ui (new-york style, radix base, Tailwind v4).
- **Registries Used:** Only official `ui.shadcn.com` registry. No third-party blocks.
- **Safety Gate:** Passed — no external third-party blocks required for this phase.
- *Source: Detected `components.json`.*