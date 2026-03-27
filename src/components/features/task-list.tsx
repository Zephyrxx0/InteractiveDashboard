"use client";

import { useState, useRef, useEffect } from "react";
import { Task, TaskStatus, STATUS_CONFIG, Assignee } from "@/types/task";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  assignees?: Assignee[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({
  tasks,
  assignees = [],
  onTaskUpdate,
  onStatusChange,
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTaskId]);

  const handleStartEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingValue(task.name);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingValue.trim() && editingValue !== tasks.find(t => t.id === taskId)?.name) {
      onTaskUpdate?.(taskId, { name: editingValue.trim() });
    }
    setEditingTaskId(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(taskId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    onStatusChange?.(taskId, status);
    onTaskUpdate?.(taskId, { status });
  };

  const handleDateChange = (taskId: string, date: Date | undefined) => {
    onTaskUpdate?.(taskId, { dueDate: date || null });
    setDatePopoverOpen(null);
  };

  const handleAssigneeChange = (taskId: string, assigneeId: string) => {
    if (assigneeId === "unassigned") {
      onTaskUpdate?.(taskId, { assignee: undefined });
    } else {
      const assignee = assignees.find(a => a.id === assigneeId);
      if (assignee) {
        onTaskUpdate?.(taskId, { assignee });
      }
    }
  };

  const formatDueDate = (date: Date | null): string => {
    if (!date) return "No date";
    if (isToday(date)) return "Today";
    return format(date, "MMM d");
  };

  const isOverdue = (date: Date | null, status: TaskStatus): boolean => {
    if (!date || status === "done") return false;
    return isPast(date) && !isToday(date);
  };

  return (
    <div className="bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 p-3 bg-background border-b border-border text-xs font-mono text-muted-foreground uppercase tracking-wider">
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-5">Task Name</div>
        <div className="col-span-3">Assignee</div>
        <div className="col-span-3 text-right">Due Date</div>
      </div>

      {/* Tasks */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-background/50 transition-colors group",
            task.status === "done" && "opacity-50"
          )}
        >
          {/* Status Dropdown */}
          <div className="col-span-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "size-7 flex items-center justify-center rounded-sm border transition-colors",
                    STATUS_CONFIG[task.status].color
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {STATUS_CONFIG[task.status].icon}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(task.id, status)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={cn(
                        "size-5 flex items-center justify-center rounded-sm",
                        STATUS_CONFIG[status].color
                      )}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {STATUS_CONFIG[status].icon}
                      </span>
                    </span>
                    <span>{STATUS_CONFIG[status].label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task Name - Inline Editing */}
          <div className="col-span-5">
            {editingTaskId === task.id ? (
              <Input
                ref={inputRef}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => handleSaveEdit(task.id)}
                onKeyDown={(e) => handleKeyDown(e, task.id)}
                className="h-8 text-sm"
              />
            ) : (
              <div
                className="cursor-pointer hover:bg-background/80 px-2 py-1 -mx-2 rounded"
                onClick={() => handleStartEditing(task)}
              >
                <span
                  className={cn(
                    "text-sm font-medium text-foreground",
                    task.status === "done" &&
                      "line-through decoration-muted-foreground"
                  )}
                >
                  {task.name}
                </span>
                {task.tags && task.tags.length > 0 && (
                  <span className="ml-2">
                    {task.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          "ml-1 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide",
                          tag.color
                        )}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Assignee Selection */}
          <div className="col-span-3">
            <Select
              value={task.assignee?.id || "unassigned"}
              onValueChange={(value) => handleAssigneeChange(task.id, value)}
            >
              <SelectTrigger className="h-8 border-0 bg-transparent hover:bg-background/50 focus:ring-0 focus:ring-offset-0">
                <SelectValue>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <img
                        alt={task.assignee.name}
                        className={cn(
                          "size-6 rounded-full border border-white shadow-sm",
                          task.status === "done" && "grayscale opacity-70"
                        )}
                        src={task.assignee.avatarUrl}
                      />
                      <span className="text-xs font-mono hidden sm:inline-block text-foreground">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-border flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                        ?
                      </div>
                      <span className="text-xs text-muted-foreground font-mono italic hidden sm:inline-block">
                        Unassigned
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-border flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                      ?
                    </div>
                    <span className="text-muted-foreground italic">
                      Unassigned
                    </span>
                  </div>
                </SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    <div className="flex items-center gap-2">
                      <img
                        alt={assignee.name}
                        className="size-6 rounded-full border border-white shadow-sm"
                        src={assignee.avatarUrl}
                      />
                      <span>{assignee.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date Picker */}
          <div className="col-span-3 text-right">
            <Popover
              open={datePopoverOpen === task.id}
              onOpenChange={(open) =>
                setDatePopoverOpen(open ? task.id : null)
              }
            >
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "text-xs font-mono px-2 py-1 rounded hover:bg-background/80 transition-colors",
                    isOverdue(task.dueDate, task.status)
                      ? "text-destructive font-medium"
                      : "text-foreground"
                  )}
                >
                  {formatDueDate(task.dueDate)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={task.dueDate || undefined}
                  onSelect={(date) => handleDateChange(task.id, date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            task
          </span>
          <p className="text-sm font-mono">No tasks to display</p>
        </div>
      )}
    </div>
  );
}
