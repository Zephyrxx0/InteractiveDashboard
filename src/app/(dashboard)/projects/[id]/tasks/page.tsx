"use client";

import { useState } from "react";
import { TaskList } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus, Assignee } from "@/types/task";

// Mock assignees for this project
const MOCK_ASSIGNEES: Assignee[] = [
  { id: "mike", name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike", email: "mike@example.com" },
];

// Mock project tasks using new Task interface
const MOCK_PROJECT_TASKS: Task[] = [
  {
    id: "T-1002",
    name: "Deploy sensors at Site B",
    status: "todo",
    assignee: MOCK_ASSIGNEES[0],
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date("2026-03-22"),
    updatedAt: new Date("2026-03-22"),
    tags: [{ label: "Field Work", color: "bg-warning/20 text-warning border border-warning/30" }],
  },
  {
    id: "T-1005",
    name: "Equipment Maintenance Log",
    status: "done",
    assignee: MOCK_ASSIGNEES[0],
    dueDate: new Date("2026-10-01"),
    createdAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-03-27"),
    tags: [{ label: "Maintenance", color: "bg-muted/50 text-muted-foreground border border-border" }],
  },
];

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_PROJECT_TASKS);

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
    <div className="p-6 grid-bg min-h-full">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Project Tasks</h2>
            <p className="text-sm text-muted-foreground">Manage tasks specific to this initiative.</p>
          </div>
          <Button className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
            <span className="material-symbols-outlined text-[16px] mr-2">add</span>
            Add Task
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          assignees={MOCK_ASSIGNEES}
          onTaskUpdate={handleTaskUpdate}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
