'use client';

import { cn } from '@/lib/utils';
import { GanttTask, GanttConfig, calculateTaskPosition } from '@/types/gantt';
import { STATUS_CONFIG } from '@/types/task';

interface GanttTaskBarProps {
  task: GanttTask;
  config: GanttConfig;
  onClick?: (task: GanttTask) => void;
  onDragStart?: (e: React.MouseEvent, task: GanttTask) => void;
  isDragging?: boolean;
}

export function GanttTaskBar({ task, config, onClick, onDragStart, isDragging }: GanttTaskBarProps) {
  const { left, width } = calculateTaskPosition(task, config);
  const statusConfig = STATUS_CONFIG[task.status];

  // Get background color based on status
  const getStatusColor = () => {
    switch (task.status) {
      case 'done':
        return 'bg-success';
      case 'in-progress':
        return 'bg-info';
      case 'blocked':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 h-8"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        minWidth: '24px',
      }}
    >
      {/* Start Node - visible on parent row hover */}
      <div 
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity gantt-node" 
        data-task-id={task.id} 
        data-node-type="start"
      />

      <div
        className={cn(
          'w-full h-full rounded flex items-center overflow-hidden transition-all select-none',
          getStatusColor(),
          isDragging
            ? 'cursor-grabbing opacity-70 shadow-lg scale-[1.02]'
            : 'cursor-grab hover:opacity-90'
        )}
        onClick={() => onClick?.(task)}
        onMouseDown={(e) => {
          // Prevent default text selection during drag
          e.preventDefault();
          onDragStart?.(e, task);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.(task)}
        title={`${task.name} (${statusConfig.label})`}
      >
        {/* Progress bar inside */}
        {task.progress !== undefined && task.progress > 0 && (
          <div
            className="absolute inset-0 bg-black/20"
            style={{ width: `${task.progress}%` }}
          />
        )}

        {/* Task name - only show if bar is wide enough */}
        {width > 60 && (
          <span className="relative z-10 px-2 text-xs text-white font-medium truncate pointer-events-none">
            {task.name}
          </span>
        )}

        {/* Assignee avatar - only show if bar is wide enough */}
        {width > 100 && task.assignee && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 size-6 rounded-full overflow-hidden border-2 border-white/30 pointer-events-none">
            <img
              src={task.assignee.avatarUrl}
              alt={task.assignee.name}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      {/* End Node - visible on parent row hover */}
      <div 
        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity gantt-node" 
        data-task-id={task.id} 
        data-node-type="end"
      />
    </div>
  );
}
