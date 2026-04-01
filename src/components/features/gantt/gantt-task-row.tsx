'use client';

import { GanttTask, GanttConfig } from '@/types/gantt';
import { GanttTaskBar } from './gantt-task-bar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * Props for the GanttTaskRow component.
 * 
 * @interface GanttTaskRowProps
 * @property {GanttTask} task - The task to render in the row
 * @property {GanttConfig} config - Gantt configuration for positioning and sizing
 * @property {function} [onDragStart] - Handler called when drag operation begins
 * @property {function} [onClick] - Handler called when task is clicked
 * @property {boolean} [isBeingDragged] - Whether this task is currently being dragged
 */
interface GanttTaskRowProps {
  task: GanttTask;
  config: GanttConfig;
  onDragStart?: (e: React.MouseEvent, task: GanttTask) => void;
  onClick?: (task: GanttTask) => void;
  isBeingDragged?: boolean;
}

/**
 * GanttTaskRow renders a single row in the Gantt chart with task details sidebar
 * and task bar in the timeline.
 * 
 * Features:
 * - Fixed-width sidebar showing task name and assignee
 * - Task bar positioned in timeline based on dates
 * - Tooltip on hover showing full task details
 * - Support for drag-drop interactions
 * 
 * @example
 * ```tsx
 * <GanttTaskRow
 *   task={myTask}
 *   config={ganttConfig}
 *   onClick={(task) => openTaskDetails(task)}
 * />
 * ```
 * 
 * @param {GanttTaskRowProps} props - Component props
 * @returns {JSX.Element} Rendered task row
 */
export function GanttTaskRow({
  task,
  config,
  onDragStart,
  onClick,
  isBeingDragged,
}: GanttTaskRowProps) {
  /**
   * Handles mouse down events to initiate drag operations.
   * 
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onDragStart) {
      onDragStart(e, task);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center border-b border-border",
        isBeingDragged && "opacity-70 bg-muted/30"
      )}
      style={{ height: config.rowHeight }}
    >
      {/* Task sidebar (fixed width) - shows task name and assignee */}
      <div className="w-[200px] flex-shrink-0 px-3 border-r border-border bg-background">
        <div className="truncate text-sm font-medium">{task.name}</div>
        <div className="text-xs text-muted-foreground">
          {task.assignee?.name || 'Unassigned'}
        </div>
      </div>
      
      {/* Task bar in timeline with tooltip */}
      <div className="flex-1 relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <div onMouseDown={handleMouseDown}>
              <GanttTaskBar
                task={task}
                config={config}
                onClick={onClick}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px]">
            <div className="space-y-1">
              <p className="font-semibold">{task.name}</p>
              <p className="text-xs">
                {format(task.startDate, 'MMM d')} – {format(task.endDate, 'MMM d, yyyy')}
              </p>
              {task.assignee && (
                <p className="text-xs">Assigned to: {task.assignee.name}</p>
              )}
              {task.progress !== undefined && (
                <p className="text-xs">Progress: {task.progress}%</p>
              )}
              {task.dependencies && task.dependencies.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Depends on: {task.dependencies.length} task{task.dependencies.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
