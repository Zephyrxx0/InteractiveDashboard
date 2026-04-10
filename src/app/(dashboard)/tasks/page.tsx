"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { TaskList, SortKey, SortDirection } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus, TaskFilters, Assignee, STATUS_CONFIG } from "@/types/task";

// Mock projects list
const MOCK_PROJECTS = [
  { id: "proj-1", name: "Website Redesign" },
  { id: "proj-2", name: "Mobile App v2" },
  { id: "proj-3", name: "API Integration" },
  { id: "proj-4", name: "Q3 Marketing" },
];

// Mock assignees list
const MOCK_ASSIGNEES: Assignee[] = [
  { id: "sarah", name: "Sarah J.", avatarUrl: "https://i.pravatar.cc/150?u=sarah", email: "sarah@example.com" },
  { id: "mike", name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike", email: "mike@example.com" },
  { id: "elena", name: "Elena M.", avatarUrl: "https://i.pravatar.cc/150?u=elena", email: "elena@example.com" },
];

// Mock tasks using new Task interface
const MOCK_TASKS: Task[] = [
  {
    id: "T-1001",
    name: "Finalize Phase 2 Environment Report",
    status: "in-progress",
    assignee: MOCK_ASSIGNEES[0],
    dueDate: new Date(),
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-25"),
    projectId: "proj-1",
    tags: [{ label: "Documentation", color: "bg-info/20 text-info border border-info/30" }],
  },
  {
    id: "T-1002",
    name: "Deploy sensors at Site B",
    status: "todo",
    assignee: MOCK_ASSIGNEES[1],
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date("2026-03-22"),
    updatedAt: new Date("2026-03-22"),
    projectId: "proj-2",
    tags: [{ label: "Field Work", color: "bg-warning/20 text-warning border border-warning/30" }],
  },
  {
    id: "T-1003",
    name: "Review Q3 Budget Allocation",
    status: "todo",
    assignee: MOCK_ASSIGNEES[2],
    dueDate: new Date("2026-10-15"),
    createdAt: new Date("2026-03-21"),
    updatedAt: new Date("2026-03-21"),
    projectId: "proj-4",
    tags: [{ label: "Finance", color: "bg-success/20 text-success border border-success/30" }],
  },
  {
    id: "T-1004",
    name: "Draft Community Outreach Plan",
    status: "blocked",
    assignee: undefined,
    dueDate: new Date("2026-10-18"),
    createdAt: new Date("2026-03-23"),
    updatedAt: new Date("2026-03-23"),
    projectId: "proj-4",
    tags: [{ label: "Planning", color: "bg-primary/20 text-primary border border-primary/30" }],
  },
  {
    id: "T-1005",
    name: "Equipment Maintenance Log",
    status: "done",
    assignee: MOCK_ASSIGNEES[1],
    dueDate: new Date("2026-10-01"),
    createdAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-03-27"),
    projectId: "proj-3",
    tags: [{ label: "Maintenance", color: "bg-muted/50 text-muted-foreground border border-border" }],
  },
  {
    id: "T-1006",
    name: "API endpoint documentation",
    status: "in-progress",
    assignee: MOCK_ASSIGNEES[0],
    dueDate: new Date("2026-10-20"),
    createdAt: new Date("2026-03-25"),
    updatedAt: new Date("2026-03-28"),
    projectId: "proj-3",
    tags: [{ label: "Documentation", color: "bg-info/20 text-info border border-info/30" }],
  },
  {
    id: "T-1007",
    name: "User testing session planning",
    status: "todo",
    assignee: MOCK_ASSIGNEES[2],
    dueDate: new Date("2026-10-22"),
    createdAt: new Date("2026-03-26"),
    updatedAt: new Date("2026-03-26"),
    projectId: "proj-2",
    tags: [{ label: "Research", color: "bg-primary/20 text-primary border border-primary/30" }],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filters, setFilters] = useState<TaskFilters>({ status: "all", assigneeId: "all", projectId: "all" });
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same key
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New key, default to ascending
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    // First filter
    let result = tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.assigneeId !== "all" && task.assignee?.id !== filters.assigneeId) return false;
      if (filters.projectId !== "all" && task.projectId !== filters.projectId) return false;
      return true;
    });

    // Then sort
    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "project":
          const projA = MOCK_PROJECTS.find(p => p.id === a.projectId)?.name || "";
          const projB = MOCK_PROJECTS.find(p => p.id === b.projectId)?.name || "";
          comparison = projA.localeCompare(projB);
          break;
        case "status":
          const statusOrder: Record<TaskStatus, number> = { todo: 0, "in-progress": 1, blocked: 2, done: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "assignee":
          const nameA = a.assignee?.name || "zzz"; // Unassigned last
          const nameB = b.assignee?.name || "zzz";
          comparison = nameA.localeCompare(nameB);
          break;
        case "dueDate":
          const dateA = a.dueDate?.getTime() || Number.MAX_SAFE_INTEGER;
          const dateB = b.dueDate?.getTime() || Number.MAX_SAFE_INTEGER;
          comparison = dateA - dateB;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sortKey, sortDirection]);

  // Task update handlers
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
      )
    );
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    handleTaskUpdate(taskId, { status });
  };

  // Count active filters
  const activeFilterCount = [
    filters.status !== "all",
    filters.assigneeId !== "all",
    filters.projectId !== "all",
  ].filter(Boolean).length;

  return (
    <>
      <PageHeader
        title="Tasks Hub"
        subtitle="Manage and track tasks horizontally across all projects"
        actions={
          <Button className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
            <span className="material-symbols-outlined text-[16px] mr-2">add</span>
            New Task
          </Button>
        }
      />

      <div className="flex-1 p-6 grid-bg">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">My Tasks</h2>
            <div className="flex items-center gap-4">
              {/* Project Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">Project:</span>
                <Select
                  value={filters.projectId || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      projectId: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 w-36 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {MOCK_PROJECTS.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">Status:</span>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value as TaskStatus | "all",
                    }))
                  }
                >
                  <SelectTrigger className="h-8 w-32 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">Assignee:</span>
                <Select
                  value={filters.assigneeId || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      assigneeId: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 w-32 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {MOCK_ASSIGNEES.map((assignee) => (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active filters indicator */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-mono"
                onClick={() => setFilters({ status: "all", assigneeId: "all", projectId: "all" })}
              >
                Clear all
              </Button>
            </div>
          )}

          <TaskList
            tasks={filteredAndSortedTasks}
            assignees={MOCK_ASSIGNEES}
            projects={MOCK_PROJECTS}
            onTaskUpdate={handleTaskUpdate}
            onStatusChange={handleStatusChange}
            showProjectColumn={true}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Task count summary */}
          <div className="text-xs font-mono text-muted-foreground">
            Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
            {sortKey && (
              <span className="ml-2">
                | Sorted by {sortKey === "dueDate" ? "due date" : sortKey} ({sortDirection === "asc" ? "ascending" : "descending"})
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
