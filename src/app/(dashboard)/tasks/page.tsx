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
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";

// Mock assignees list (Keep until Users table is added)
const MOCK_ASSIGNEES: Assignee[] = [
  { id: "sarah", name: "Sarah J.", avatarUrl: "https://i.pravatar.cc/150?u=sarah", email: "sarah@example.com" },
  { id: "mike", name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike", email: "mike@example.com" },
  { id: "elena", name: "Elena M.", avatarUrl: "https://i.pravatar.cc/150?u=elena", email: "elena@example.com" },
];

export default function TasksPage() {
  const { data: dbTasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: dbProjects = [], isLoading: isLoadingProjects } = useProjects();
  const updateTaskMutation = useUpdateTask();

  // Map backend projects to UI format
  const projects = useMemo(() => {
    return dbProjects.map((p) => ({
      id: p.id,
      name: p.name,
    }));
  }, [dbProjects]);

  // Map backend Tasks to UI format
  const tasks = useMemo(() => {
    return dbTasks.map(t => ({
      id: t.id,
      name: t.title, // DB 'title' mapping to 'name'
      status: t.status as TaskStatus,
      // Map arbitrary assignee ID string back to mock assignees or first for now
      assignee: t.assignees?.[0] ? MOCK_ASSIGNEES.find(a => a.id === t.assignees![0]) || MOCK_ASSIGNEES[0] : undefined,
      dueDate: t.due_date ? new Date(t.due_date) : undefined,
      createdAt: new Date(t.created_at),
      updatedAt: new Date(t.updated_at),
      projectId: t.project_id || undefined,
      tags: [], // Tags table is separate, keep empty for now
    })) as Task[];
  }, [dbTasks]);

  const [filters, setFilters] = useState<TaskFilters>({ status: "all", assigneeId: "all", projectId: "all" });
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.assigneeId !== "all" && task.assignee?.id !== filters.assigneeId) return false;
      if (filters.projectId !== "all" && task.projectId !== filters.projectId) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "project":
          const projA = projects.find(p => p.id === a.projectId)?.name || "";
          const projB = projects.find(p => p.id === b.projectId)?.name || "";
          comparison = projA.localeCompare(projB);
          break;
        case "status":
          const statusOrder: Record<TaskStatus, number> = { todo: 0, "in-progress": 1, blocked: 2, done: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "assignee":
          const nameA = a.assignee?.name || "zzz";
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
  }, [tasks, filters, sortKey, sortDirection, projects]);

  // Task update handlers
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.name) dbUpdates.title = updates.name;
    if (updates.assignee) dbUpdates.assignees = [updates.assignee.id];
    // dueDate etc could also be mapped

    updateTaskMutation.mutate({ id: taskId, updates: dbUpdates });
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    handleTaskUpdate(taskId, { status });
  };

  const activeFilterCount = [
    filters.status !== "all",
    filters.assigneeId !== "all",
    filters.projectId !== "all",
  ].filter(Boolean).length;

  if (isLoadingTasks || isLoadingProjects) {
    return <div className="p-8">Loading tasks...</div>;
  }

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
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
            projects={projects}
            onTaskUpdate={handleTaskUpdate}
            onStatusChange={handleStatusChange}
            showProjectColumn={true}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

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
