// src/types/task.ts

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';

export interface Assignee {
  id: string;
  name: string;
  avatarUrl: string;
  email?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  assignee?: Assignee;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{ label: string; color: string }>;
  projectId?: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  assigneeId?: string | 'all';
  dueDateRange?: { from: Date; to: Date };
}

// Status display configuration
export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  'todo': { label: 'To Do', color: 'bg-muted/50 text-muted-foreground', icon: 'circle' },
  'in-progress': { label: 'In Progress', color: 'bg-info/20 text-info', icon: 'pending' },
  'done': { label: 'Done', color: 'bg-success/20 text-success', icon: 'check_circle' },
  'blocked': { label: 'Blocked', color: 'bg-destructive/20 text-destructive', icon: 'block' },
};
