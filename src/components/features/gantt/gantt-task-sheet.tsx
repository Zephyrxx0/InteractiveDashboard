'use client';

import { useState, useEffect } from 'react';
import { GanttTask } from '@/types/gantt';
import { TaskStatus, STATUS_CONFIG } from '@/types/task';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface GanttTaskSheetProps {
  task: GanttTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updates: Partial<GanttTask>) => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Slide-out panel for viewing and editing Gantt task details.
 * Supports editing name, description, status, dates, and progress.
 */
export function GanttTaskSheet({
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: GanttTaskSheetProps) {
  // Local form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [progress, setProgress] = useState(0);

  // Sync form state when task changes
  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || '');
      setStatus(task.status);
      setStartDate(task.startDate);
      setEndDate(task.endDate);
      setProgress(task.progress ?? 0);
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !startDate || !endDate) return;
    
    onSave(task.id, {
      name,
      description: description || undefined,
      status,
      startDate,
      endDate,
      progress,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!task || !onDelete) return;
    if (confirm(`Delete task "${task.name}"?`)) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono uppercase tracking-wider text-sm">
            Task Details
          </SheetTitle>
          <SheetDescription>
            Edit task properties and schedule
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Task ID (read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Task ID
            </label>
            <div className="font-mono text-sm bg-muted/30 px-3 py-2 rounded border border-border">
              {task.id}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task name"
              className="font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(STATUS_CONFIG) as [TaskStatus, typeof STATUS_CONFIG[TaskStatus]][]).map(
                  ([key, config]) => (
                    <SelectItem key={key} value={key} className="font-mono">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
                        {config.label}
                      </span>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-mono text-sm',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <span className="material-symbols-outlined text-[16px] mr-2">calendar_today</span>
                    {startDate ? format(startDate, 'MMM d, yyyy') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-mono text-sm',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <span className="material-symbols-outlined text-[16px] mr-2">event</span>
                    {endDate ? format(endDate, 'MMM d, yyyy') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Dependencies (read-only for now) */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Dependencies
              </label>
              <div className="flex flex-wrap gap-2">
                {task.dependencies.map((depId) => (
                  <span
                    key={depId}
                    className="px-2 py-1 bg-muted/50 rounded text-xs font-mono"
                  >
                    {depId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Created</span>
              <span>{format(task.createdAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Updated</span>
              <span>{format(task.updatedAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2">
          {onDelete && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive font-mono text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[16px] mr-2">delete</span>
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-mono text-xs uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || !startDate || !endDate}
            className="font-mono text-xs uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[16px] mr-2">save</span>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
