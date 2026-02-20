"use client";

import { cn } from "@/lib/utils";

interface Task {
  id: string;
  name: string;
  assignee?: { name: string; avatarUrl: string };
  dueDate: string;
  completed?: boolean;
  tag?: { label: string; color: string };
  dueDateUrgent?: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 p-3 bg-background border-b border-border text-xs font-mono text-muted-foreground uppercase tracking-wider">
        <div className="col-span-1 text-center">Done</div>
        <div className="col-span-6">Task Name</div>
        <div className="col-span-3">Assignee</div>
        <div className="col-span-2 text-right">Due Date</div>
      </div>

      {/* Tasks */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-background/50 transition-colors group",
            task.completed && "opacity-50"
          )}
        >
          <div className="col-span-1 flex justify-center">
            <button
              className={cn(
                "size-5 flex items-center justify-center",
                task.completed
                  ? "bg-primary border border-primary text-white"
                  : "bg-card border border-border hover:border-primary text-transparent group-hover:text-primary/20"
              )}
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
            </button>
          </div>
          <div className="col-span-6">
            <span
              className={cn(
                "text-sm font-medium text-foreground",
                task.completed && "line-through decoration-muted-foreground"
              )}
            >
              {task.name}
            </span>
            {task.tag && (
              <span
                className={cn(
                  "ml-2 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide",
                  task.tag.color
                )}
              >
                {task.tag.label}
              </span>
            )}
          </div>
          <div className="col-span-3 flex items-center gap-2">
            {task.assignee ? (
              <>
                <img
                  alt={task.assignee.name}
                  className={cn(
                    "size-6 rounded-full border border-white shadow-sm",
                    task.completed && "grayscale opacity-70"
                  )}
                  src={task.assignee.avatarUrl}
                />
                <span className="text-xs font-mono hidden sm:inline-block text-foreground">
                  {task.assignee.name}
                </span>
              </>
            ) : (
              <>
                <div className="size-6 rounded-full bg-border flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                  ?
                </div>
                <span className="text-xs text-muted-foreground font-mono italic hidden sm:inline-block">
                  Unassigned
                </span>
              </>
            )}
          </div>
          <div className="col-span-2 text-right">
            <span
              className={cn(
                "text-xs font-mono",
                task.dueDateUrgent ? "text-eco-clay font-medium" : "text-foreground"
              )}
            >
              {task.dueDate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
