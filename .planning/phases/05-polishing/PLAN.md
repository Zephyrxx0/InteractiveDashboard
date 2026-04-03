---
status: in-progress
phase: 05-polishing
started: 2026-04-02
updated: 2026-04-03
---

## Overview

Phase 5 is for UI/UX polishing, refinement, and small improvements that don't warrant their own feature phase. Items are added by user request during testing or review.

---

## Completed Tasks

### Task 0: Theme Color Scheme Update ✅
**Status:** COMPLETE (see `05-01-SUMMARY.md`)

Updated the dashboard from green "Eco-Grid" theme to white/red/teal palette:
- Primary: White backgrounds
- Secondary/Accents: Red (#E53935 / oklch 0.55 0.22 25)
- Tertiary: Teal/Cyan complementary colors

**Files Modified:**
- `src/theme/default.css` - Light theme
- `src/theme/dark.css` - Dark theme
- Stitch design system updated

---

## Pending Tasks

---

### Task 1: Sidebar Icon & Expand Panel Alignment

**Problem Description:**
1. The sidebar trigger icon is not centered correctly in its button container
2. The height of the icon section differs from the expand panel icon section
3. Inconsistent vertical spacing creates poor visual hierarchy

**Visual Reference:** Screenshot Img 1

**Acceptance Criteria:**
- [ ] Sidebar trigger icon is perfectly centered (horizontal + vertical)
- [ ] Icon section height matches expand panel section height
- [ ] Consistent vertical rhythm across all sidebar states (collapsed/expanded)

**Implementation Steps:**

1. **Locate the sidebar component:**
   ```
   src/components/ui/sidebar.tsx
   ```

2. **Fix icon centering in trigger button:**
   - Find the `SidebarTrigger` or equivalent component
   - Ensure the button uses `flex items-center justify-center`
   - Set explicit dimensions: `h-10 w-10` or similar
   - Remove any padding that causes offset

3. **Align icon section with expand panel:**
   - Find the sidebar header/logo section
   - Find the collapse/expand panel trigger section
   - Ensure both use the same height: `h-14` or `h-16`
   - Use consistent padding: `px-3 py-2` or similar

4. **CSS Pattern to apply:**
   ```tsx
   // Trigger button
   <Button 
     variant="ghost" 
     size="icon"
     className="h-10 w-10 flex items-center justify-center"
   >
     <Icon className="h-5 w-5" />
   </Button>
   
   // Header section
   <div className="h-14 flex items-center px-3">
     {/* Logo + collapse button */}
   </div>
   ```

**Files to Modify:**
- `src/components/ui/sidebar.tsx`
- `src/components/layout/app-shell.tsx` (if sidebar is composed there)

---

### Task 2: Settings Tab - Custom Icon Selection

**Problem Description:**
Users cannot customize icons for projects/items. Need ability to select or upload custom icons in the settings interface.

**Visual Reference:** Screenshot Img 1 (settings context)

**Acceptance Criteria:**
- [ ] Settings tab has an "Icon" or "Appearance" section
- [ ] User can select from a predefined icon library (Lucide icons)
- [ ] Selected icon persists and displays in relevant UI locations
- [ ] (Stretch) User can upload custom icon images

**Implementation Steps:**

1. **Create IconPicker component:**
   ```
   src/components/ui/icon-picker.tsx
   ```

2. **Component structure:**
   ```tsx
   "use client"
   
   import { useState } from "react"
   import { Popover, PopoverContent, PopoverTrigger } from "./popover"
   import { Button } from "./button"
   import { cn } from "@/lib/utils"
   import * as LucideIcons from "lucide-react"
   
   // Curated list of common icons
   const ICON_OPTIONS = [
     "Folder", "FileText", "Calendar", "CheckSquare", "Users",
     "Settings", "Home", "Star", "Heart", "Flag", "Tag", "Bookmark",
     "Clock", "Bell", "Mail", "MessageSquare", "Image", "Video",
     "Music", "Code", "Database", "Server", "Globe", "Zap"
   ]
   
   interface IconPickerProps {
     value?: string
     onChange: (icon: string) => void
     className?: string
   }
   
   export function IconPicker({ value, onChange, className }: IconPickerProps) {
     const [open, setOpen] = useState(false)
     const SelectedIcon = value ? LucideIcons[value as keyof typeof LucideIcons] : LucideIcons.Folder
     
     return (
       <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
           <Button variant="outline" className={cn("w-full justify-start", className)}>
             <SelectedIcon className="h-4 w-4 mr-2" />
             {value || "Select icon"}
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-64 p-2">
           <div className="grid grid-cols-6 gap-1">
             {ICON_OPTIONS.map((iconName) => {
               const Icon = LucideIcons[iconName as keyof typeof LucideIcons]
               return (
                 <Button
                   key={iconName}
                   variant={value === iconName ? "default" : "ghost"}
                   size="icon"
                   className="h-8 w-8"
                   onClick={() => {
                     onChange(iconName)
                     setOpen(false)
                   }}
                 >
                   <Icon className="h-4 w-4" />
                 </Button>
               )
             })}
           </div>
         </PopoverContent>
       </Popover>
     )
   }
   ```

3. **Integrate into Settings page:**
   - Find settings form/page component
   - Add IconPicker field to the form
   - Connect to state management (context or form state)

**Files to Modify:**
- Create: `src/components/ui/icon-picker.tsx`
- Modify: Settings page component (likely in `src/app/(dashboard)/settings/`)

---

### Task 3: Tab Border & Line Alignment Fix

**Problem Description:**
Tab borders appear uneven or misaligned, creating an unfinished look. The visual hierarchy between sections is unclear.

**Visual Reference:** Screenshot Img 2

**Acceptance Criteria:**
- [ ] Tab borders are consistently aligned
- [ ] Main section borders are visually distinct with proper separation
- [ ] Border colors use theme tokens (not hardcoded)

**Implementation Steps:**

1. **Locate tabs component:**
   ```
   src/components/ui/tabs.tsx
   ```

2. **Fix TabsList border alignment:**
   ```tsx
   const TabsList = React.forwardRef<...>(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn(
         "inline-flex h-10 items-center justify-start",
         "rounded-lg bg-muted p-1",
         "border-b border-border",  // Add consistent bottom border
         className
       )}
       {...props}
     />
   ))
   ```

3. **Add section separation:**
   ```tsx
   // In page layouts, add margin between tab content sections
   <TabsContent className="mt-4 pt-4 border-t border-border">
     {/* content */}
   </TabsContent>
   ```

4. **Ensure border colors use CSS variables:**
   ```css
   /* In theme files, ensure these exist */
   --border: oklch(0.85 0 0);  /* Light mode */
   --border: oklch(0.3 0 0);   /* Dark mode */
   ```

**Files to Modify:**
- `src/components/ui/tabs.tsx`
- Page components using tabs

---

### Task 4: Tab Selection State - Fill Instead of Border

**Problem Description:**
When selecting a tab, the border goes out of bounds of the tab container. The selection indicator should use background fill instead of border.

**Visual Reference:** Screenshot Img 3

**Acceptance Criteria:**
- [ ] Active tab uses background fill (not border) to indicate selection
- [ ] Hover state shows subtle background change
- [ ] No visual overflow beyond tab container
- [ ] Smooth transition between states

**Implementation Steps:**

1. **Update TabsTrigger component:**
   ```tsx
   const TabsTrigger = React.forwardRef<...>(({ className, ...props }, ref) => (
     <button
       ref={ref}
       className={cn(
         "inline-flex items-center justify-center whitespace-nowrap",
         "rounded-md px-3 py-1.5 text-sm font-medium",
         "transition-all duration-200",
         // Remove border-based selection
         // OLD: "data-[state=active]:border-b-2 data-[state=active]:border-primary"
         // NEW: Fill-based selection
         "text-muted-foreground",
         "hover:bg-accent hover:text-accent-foreground",
         "data-[state=active]:bg-background data-[state=active]:text-foreground",
         "data-[state=active]:shadow-sm",
         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
         className
       )}
       {...props}
     />
   ))
   ```

2. **Alternative: Use accent color for active state:**
   ```tsx
   "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
   ```

3. **Ensure TabsList has proper containment:**
   ```tsx
   <TabsList className="overflow-hidden rounded-lg">
   ```

**Files to Modify:**
- `src/components/ui/tabs.tsx`

---

### Task 5: Gantt Chart - Remove Arrows & Nodes

**Problem Description:**
The Gantt/timeline view has arrows and nodes connecting tasks that make drag-and-drop confusing. Simplify by removing these visual elements.

**Visual Reference:** Screenshot Img 4

**Acceptance Criteria:**
- [ ] No arrows between task bars
- [ ] No connection nodes/handles on task bars
- [ ] Task bars remain draggable without visual connectors
- [ ] Clean, minimal timeline appearance

**Implementation Steps:**

1. **Locate Gantt components:**
   ```
   src/components/features/gantt-bar.tsx
   src/components/features/gantt-chart.tsx (or similar)
   ```

2. **Remove arrow/connector rendering:**
   - Find SVG path or line elements drawing arrows
   - Find node/handle elements at bar endpoints
   - Comment out or remove these elements

3. **Example removal pattern:**
   ```tsx
   // BEFORE: With arrows
   <svg className="absolute pointer-events-none">
     <path d="..." className="stroke-muted-foreground" />
     <circle cx="..." cy="..." r="4" className="fill-primary" />
   </svg>
   
   // AFTER: Removed
   {/* Arrows and connectors removed for cleaner UX */}
   ```

4. **Simplify task bar:**
   ```tsx
   export function GanttBar({ task, ...props }) {
     return (
       <div
         className={cn(
           "absolute h-8 rounded-md cursor-move",
           "bg-primary/20 border border-primary/40",
           "hover:bg-primary/30 transition-colors"
         )}
         style={{ left: startPos, width: barWidth }}
         {...props}
       >
         <span className="px-2 text-sm truncate">{task.title}</span>
       </div>
     )
   }
   ```

**Files to Modify:**
- `src/components/features/gantt-bar.tsx`
- `src/components/features/gantt-chart.tsx`
- Any related timeline components

---

### Task 6: Custom Tangible Outputs & Key Outcomes - Add Card Pattern

**Problem Description:**
Adding new Tangible Outputs or Key Outcomes uses a button. Replace with a card-based "Add New" pattern that's more intuitive and visually consistent.

**Visual Reference:** Screenshot Img 5

**Acceptance Criteria:**
- [ ] "Add new" action is a card placeholder (not a button)
- [ ] Card has dashed border and "+" icon
- [ ] Clicking card opens inline form or modal
- [ ] Consistent with existing card grid layout

**Implementation Steps:**

1. **Create AddCard component:**
   ```
   src/components/ui/add-card.tsx
   ```

2. **Component implementation:**
   ```tsx
   "use client"
   
   import { Plus } from "lucide-react"
   import { cn } from "@/lib/utils"
   
   interface AddCardProps {
     label?: string
     onClick: () => void
     className?: string
   }
   
   export function AddCard({ label = "Add new", onClick, className }: AddCardProps) {
     return (
       <button
         onClick={onClick}
         className={cn(
           "flex flex-col items-center justify-center",
           "min-h-[120px] w-full rounded-lg",
           "border-2 border-dashed border-muted-foreground/30",
           "text-muted-foreground",
           "hover:border-primary/50 hover:text-primary hover:bg-primary/5",
           "transition-all duration-200",
           "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
           className
         )}
       >
         <Plus className="h-8 w-8 mb-2" />
         <span className="text-sm font-medium">{label}</span>
       </button>
     )
   }
   ```

3. **Integrate into Tangible Outputs section:**
   ```tsx
   // In project detail page
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {outputs.map(output => (
       <OutputCard key={output.id} output={output} />
     ))}
     <AddCard 
       label="Add Output" 
       onClick={() => setShowAddModal(true)} 
     />
   </div>
   ```

4. **Same pattern for Key Outcomes:**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {outcomes.map(outcome => (
       <OutcomeCard key={outcome.id} outcome={outcome} />
     ))}
     <AddCard 
       label="Add Outcome" 
       onClick={() => setShowOutcomeModal(true)} 
     />
   </div>
   ```

**Files to Modify:**
- Create: `src/components/ui/add-card.tsx`
- Modify: Project detail page (`src/app/(dashboard)/projects/[id]/page.tsx`)
- Modify: Output tracker component (`src/components/features/output-tracker.tsx`)

---

### Task 7: Reports - Add Create/Manage Functionality

**Problem Description:**
Reports section lacks create and manage capabilities. Users need to generate new reports and manage existing ones.

**Visual Reference:** Screenshot Img 6

**Acceptance Criteria:**
- [ ] "Create Report" button in reports page header
- [ ] Report creation form/modal with type selection
- [ ] Report list shows edit/delete actions
- [ ] Confirmation dialog for delete action

**Implementation Steps:**

1. **Update Reports page header:**
   ```tsx
   // src/app/(dashboard)/reports/page.tsx
   import { PageHeader } from "@/components/ui/page-header"
   import { Button } from "@/components/ui/button"
   import { Plus } from "lucide-react"
   
   export default function ReportsPage() {
     return (
       <div>
         <PageHeader 
           title="Reports"
           description="Generate and manage project reports"
         >
           <Button onClick={() => setShowCreateModal(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Create Report
           </Button>
         </PageHeader>
         {/* Report list */}
       </div>
     )
   }
   ```

2. **Create Report Creation Modal:**
   ```tsx
   // src/components/features/create-report-modal.tsx
   "use client"
   
   import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
   import { Button } from "@/components/ui/button"
   import { Label } from "@/components/ui/label"
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
   
   const REPORT_TYPES = [
     { value: "project-summary", label: "Project Summary" },
     { value: "task-progress", label: "Task Progress" },
     { value: "team-performance", label: "Team Performance" },
     { value: "timeline-analysis", label: "Timeline Analysis" },
   ]
   
   export function CreateReportModal({ open, onOpenChange }) {
     return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Create New Report</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div>
               <Label>Report Type</Label>
               <Select>
                 <SelectTrigger>
                   <SelectValue placeholder="Select report type" />
                 </SelectTrigger>
                 <SelectContent>
                   {REPORT_TYPES.map(type => (
                     <SelectItem key={type.value} value={type.value}>
                       {type.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             {/* Date range, project selection, etc. */}
             <Button className="w-full">Generate Report</Button>
           </div>
         </DialogContent>
       </Dialog>
     )
   }
   ```

3. **Add actions to report cards/rows:**
   ```tsx
   // In report list item
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="ghost" size="icon">
         <MoreHorizontal className="h-4 w-4" />
       </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align="end">
       <DropdownMenuItem onClick={() => handleEdit(report)}>
         <Pencil className="h-4 w-4 mr-2" /> Edit
       </DropdownMenuItem>
       <DropdownMenuItem onClick={() => handleDuplicate(report)}>
         <Copy className="h-4 w-4 mr-2" /> Duplicate
       </DropdownMenuItem>
       <DropdownMenuSeparator />
       <DropdownMenuItem 
         onClick={() => handleDelete(report)}
         className="text-destructive"
       >
         <Trash className="h-4 w-4 mr-2" /> Delete
       </DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
   ```

**Files to Modify:**
- `src/app/(dashboard)/reports/page.tsx`
- Create: `src/components/features/create-report-modal.tsx`
- Report list/card components

---

### Task 8: Tasks Hub - Add Project Column, Sort & Filter

**Problem Description:**
The tasks table/list doesn't show which project each task belongs to, and lacks sorting and filtering capabilities.

**Visual Reference:** Screenshot Img 7

**Acceptance Criteria:**
- [ ] "Project" column added to task table
- [ ] Column headers are clickable for sorting
- [ ] Filter dropdown for: Project, Status, Assignee, Date Range
- [ ] Active filters shown as chips/badges
- [ ] Clear filters action

**Implementation Steps:**

1. **Add Project column to task table:**
   ```tsx
   // In task list/table component
   const columns = [
     { key: "title", label: "Task", sortable: true },
     { key: "project", label: "Project", sortable: true },  // NEW
     { key: "status", label: "Status", sortable: true },
     { key: "assignee", label: "Assignee", sortable: true },
     { key: "dueDate", label: "Due Date", sortable: true },
   ]
   ```

2. **Create Filter Bar component:**
   ```tsx
   // src/components/features/task-filters.tsx
   "use client"
   
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
   import { Button } from "@/components/ui/button"
   import { Badge } from "@/components/ui/badge"
   import { X } from "lucide-react"
   
   interface TaskFiltersProps {
     projects: { id: string; name: string }[]
     filters: {
       project?: string
       status?: string
       assignee?: string
     }
     onFilterChange: (filters: any) => void
   }
   
   export function TaskFilters({ projects, filters, onFilterChange }: TaskFiltersProps) {
     const activeFilters = Object.entries(filters).filter(([_, v]) => v)
     
     return (
       <div className="flex flex-wrap items-center gap-2 mb-4">
         <Select 
           value={filters.project} 
           onValueChange={(v) => onFilterChange({ ...filters, project: v })}
         >
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="All Projects" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All Projects</SelectItem>
             {projects.map(p => (
               <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
             ))}
           </SelectContent>
         </Select>
         
         <Select 
           value={filters.status}
           onValueChange={(v) => onFilterChange({ ...filters, status: v })}
         >
           <SelectTrigger className="w-[150px]">
             <SelectValue placeholder="All Statuses" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All Statuses</SelectItem>
             <SelectItem value="todo">To Do</SelectItem>
             <SelectItem value="in-progress">In Progress</SelectItem>
             <SelectItem value="done">Done</SelectItem>
           </SelectContent>
         </Select>
         
         {/* Active filter badges */}
         {activeFilters.length > 0 && (
           <div className="flex items-center gap-1 ml-2">
             {activeFilters.map(([key, value]) => (
               <Badge key={key} variant="secondary" className="gap-1">
                 {key}: {value}
                 <button onClick={() => onFilterChange({ ...filters, [key]: undefined })}>
                   <X className="h-3 w-3" />
                 </button>
               </Badge>
             ))}
             <Button 
               variant="ghost" 
               size="sm"
               onClick={() => onFilterChange({})}
             >
               Clear all
             </Button>
           </div>
         )}
       </div>
     )
   }
   ```

3. **Add sortable column headers:**
   ```tsx
   // Sortable table header
   function SortableHeader({ column, sortKey, sortDir, onSort }) {
     const isActive = sortKey === column.key
     return (
       <th 
         className="cursor-pointer hover:bg-muted/50 transition-colors"
         onClick={() => onSort(column.key)}
       >
         <div className="flex items-center gap-1">
           {column.label}
           {isActive && (
             sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
           )}
         </div>
       </th>
     )
   }
   ```

4. **Implement sort/filter state:**
   ```tsx
   const [sortKey, setSortKey] = useState<string>("dueDate")
   const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
   const [filters, setFilters] = useState({})
   
   const filteredTasks = useMemo(() => {
     let result = tasks
     
     if (filters.project) {
       result = result.filter(t => t.projectId === filters.project)
     }
     if (filters.status) {
       result = result.filter(t => t.status === filters.status)
     }
     
     result.sort((a, b) => {
       const aVal = a[sortKey]
       const bVal = b[sortKey]
       const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
       return sortDir === "asc" ? cmp : -cmp
     })
     
     return result
   }, [tasks, filters, sortKey, sortDir])
   ```

**Files to Modify:**
- `src/components/features/task-list.tsx`
- Create: `src/components/features/task-filters.tsx`
- `src/app/(dashboard)/tasks/page.tsx`

---

## Implementation Notes

- Each task should be addressed individually with proper testing
- Ensure changes are responsive across breakpoints
- Verify accessibility (keyboard nav, screen readers) after changes
- Test drag-and-drop functionality after simplifying arrows/nodes
- Custom fields (Task 6) may require schema changes or flexible field system

## Principles

- Small, focused changes only
- No new features - only refinement of existing functionality
- Visual polish, micro-interactions, edge cases
- Accessibility improvements
- Performance optimizations

## Guidelines

When executing a task:
1. Read the task requirements and acceptance criteria
2. Locate the files to modify
3. Implement following the provided code patterns
4. Test the changes
5. Mark as done in this file
6. Commit with message: `polish(05): Task N - Brief description`
