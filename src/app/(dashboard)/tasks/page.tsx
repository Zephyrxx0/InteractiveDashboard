"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { TaskList } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus, TaskFilters, Assignee, STATUS_CONFIG } from "@/types/task";

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
    tags: [{ label: "Maintenance", color: "bg-muted/50 text-muted-foreground border border-border" }],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filters, setFilters] = useState<TaskFilters>({ status: "all", assigneeId: "all" });

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.assigneeId !== "all" && task.assignee?.id !== filters.assigneeId) return false;
      return true;
    });
  }, [tasks, filters]);

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

          <TaskList
            tasks={filteredTasks}
            assignees={MOCK_ASSIGNEES}
            onTaskUpdate={handleTaskUpdate}
            onStatusChange={handleStatusChange}
          />

          {/* Task count summary */}
          <div className="text-xs font-mono text-muted-foreground">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </div>
    </>
  );
}
