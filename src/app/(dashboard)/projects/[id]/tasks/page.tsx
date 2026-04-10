"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { TaskList } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus, Assignee } from "@/types/task";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";

// Mock assignees for this project
const MOCK_ASSIGNEES: Assignee[] = [
  { id: "mike", name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike", email: "mike@example.com" },
  { id: "sarah", name: "Sarah J.", avatarUrl: "https://i.pravatar.cc/150?u=sarah", email: "sarah@example.com" },
  { id: "elena", name: "Elena M.", avatarUrl: "https://i.pravatar.cc/150?u=elena", email: "elena@example.com" },
];

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { data: dbTasks = [], isLoading } = useTasks(projectId);
  const updateTaskMutation = useUpdateTask();

  const tasks = useMemo(() => {
    return dbTasks.map((t) => ({
      id: t.id,
      name: t.title,
      status: t.status as TaskStatus,
      assignee: t.assignees?.[0] ? MOCK_ASSIGNEES.find(a => a.id === t.assignees![0]) || MOCK_ASSIGNEES[0] : undefined,
      dueDate: t.due_date ? new Date(t.due_date) : undefined,
      createdAt: new Date(t.created_at),
      updatedAt: new Date(t.updated_at),
      projectId: t.project_id || undefined,
      tags: [],
    })) as Task[];
  }, [dbTasks]);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.name) dbUpdates.title = updates.name;
    if (updates.assignee) dbUpdates.assignees = [updates.assignee.id];

    updateTaskMutation.mutate({ id: taskId, updates: dbUpdates });
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    handleTaskUpdate(taskId, { status });
  };

  if (isLoading) {
    return <div className="p-8">Loading tasks...</div>;
  }

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
