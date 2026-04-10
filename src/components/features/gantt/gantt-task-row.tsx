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
 * @property {function} [onNodeClick] - Handler called when a connection node is clicked
 * @property {boolean} [isBeingDragged] - Whether this task is currently being dragged
 * @property {boolean} [isConnecting] - Whether a connection operation is in progress
 * @property {boolean} [isConnectionSource] - Whether this task is the source of an in-progress connection
 * @property {boolean} [showNodes] - Whether to show connection nodes on task bars
 */
interface GanttTaskRowProps {
  task: GanttTask;
  config: GanttConfig;
  onDragStart?: (e: React.MouseEvent, task: GanttTask) => void;
  onClick?: (task: GanttTask) => void;
  onNodeClick?: (taskId: string, nodeType: 'start' | 'end') => void;
  isBeingDragged?: boolean;
  isConnecting?: boolean;
  isConnectionSource?: boolean;
  showNodes?: boolean;
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
  onNodeClick,
  isBeingDragged,
  isConnecting,
  isConnectionSource,
  showNodes = false,
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
        "group relative border-b border-border/20 hover:bg-muted/20 transition-colors",
        isBeingDragged && "opacity-70 bg-muted/30"
      )}
      style={{ height: config.rowHeight }}
    >
      {/* Task bar in timeline with tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div onMouseDown={handleMouseDown} className="absolute inset-0">
            <GanttTaskBar
              task={task}
              config={config}
              onClick={onClick}
              onNodeClick={onNodeClick}
              isDragging={isBeingDragged}
              isConnecting={isConnecting}
              isConnectionSource={isConnectionSource}
              showNodes={showNodes}
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
  );
}
