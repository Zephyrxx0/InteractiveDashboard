'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { animate } from 'animejs';
import { GanttTask, GanttConfig, ZoomLevel, ZOOM_COLUMN_WIDTHS, getColumnCount } from '@/types/gantt';
import { GanttTaskBar } from './gantt-task-bar';
import { GanttTimelineHeader } from './gantt-timeline-header';
import { GanttDependencyLine, DependencyArrowMarker } from './gantt-dependency-line';
import { useGanttDrag } from '@/hooks/use-gantt-drag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addDays, subDays, min, max } from 'date-fns';

/** State for creating a new connection between tasks */
interface ConnectionState {
  isConnecting: boolean;
  fromTaskId: string | null;
  fromNodeType: 'start' | 'end' | null;
}

interface GanttChartProps {
  tasks: GanttTask[];
  startDate?: Date;
  endDate?: Date;
  onTaskClick?: (task: GanttTask) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
  onConnectionAdd?: (fromTaskId: string, toTaskId: string) => void;
  onConnectionRemove?: (fromTaskId: string, toTaskId: string) => void;
  showDependencies?: boolean;
  className?: string;
}

export function GanttChart({
  tasks,
  startDate: propStartDate,
  endDate: propEndDate,
  onTaskClick,
  onTaskUpdate,
  onConnectionAdd,
  onConnectionRemove,
  showDependencies = true,
  className,
}: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    fromTaskId: null,
    fromNodeType: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate date range from tasks if not provided
  const dateRange = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: propStartDate ?? subDays(today, 7),
        end: propEndDate ?? addDays(today, 30),
      };
    }

    const taskStarts = tasks.map((t) => t.startDate);
    const taskEnds = tasks.map((t) => t.endDate);

    const earliestStart = min(taskStarts);
    const latestEnd = max(taskEnds);

    // Add padding (1 week before and after)
    return {
      start: propStartDate ?? subDays(earliestStart, 7),
      end: propEndDate ?? addDays(latestEnd, 7),
    };
  }, [tasks, propStartDate, propEndDate]);

  const config: GanttConfig = useMemo(
    () => ({
      zoomLevel,
      startDate: dateRange.start,
      endDate: dateRange.end,
      rowHeight: 48,
      columnWidth: ZOOM_COLUMN_WIDTHS[zoomLevel],
    }),
    [zoomLevel, dateRange]
  );

  // Calculate total chart width
  const totalWidth = useMemo(() => {
    const columnCount = getColumnCount(config);
    return columnCount * config.columnWidth;
  }, [config]);

  // Calculate total chart height
  const totalHeight = useMemo(() => {
    return tasks.length * config.rowHeight;
  }, [tasks.length, config.rowHeight]);

  // Drag-drop hook integration
  const { isDragging, draggedTaskId, handleDragStart, handleDragMove, handleDragEnd } = useGanttDrag({
    config,
    onTaskUpdate: (taskId, startDate, endDate) => {
      onTaskUpdate?.(taskId, { startDate, endDate });
    },
  });

  // Connection node click handler - start or complete a connection
  const handleNodeClick = useCallback((taskId: string, nodeType: 'start' | 'end') => {
    if (!connectionState.isConnecting) {
      // Start a new connection from this node
      setConnectionState({
        isConnecting: true,
        fromTaskId: taskId,
        fromNodeType: nodeType,
      });
    } else if (connectionState.fromTaskId && connectionState.fromTaskId !== taskId) {
      // Complete the connection to this task
      // Connection goes from the "end" of source to "start" of target (typical dependency)
      if (connectionState.fromNodeType === 'end' && nodeType === 'start') {
        onConnectionAdd?.(connectionState.fromTaskId, taskId);
      } else if (connectionState.fromNodeType === 'start' && nodeType === 'end') {
        // Reverse direction
        onConnectionAdd?.(taskId, connectionState.fromTaskId);
      }
      // Reset connection state
      setConnectionState({ isConnecting: false, fromTaskId: null, fromNodeType: null });
    } else {
      // Clicked same task or invalid - cancel
      setConnectionState({ isConnecting: false, fromTaskId: null, fromNodeType: null });
    }
  }, [connectionState, onConnectionAdd]);

  // Cancel connection on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && connectionState.isConnecting) {
        setConnectionState({ isConnecting: false, fromTaskId: null, fromNodeType: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [connectionState.isConnecting]);

  // Add window event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Animate dependency lines on load using animejs v4 API
  useEffect(() => {
    if (showDependencies && tasks.length > 0) {
      // Get all dependency line paths
      const paths = document.querySelectorAll('.dependency-path');
      if (!paths.length) return;

      // Calculate total path length for each path and set initial dashoffset
      paths.forEach((path) => {
        const svgPath = path as SVGPathElement;
        const length = svgPath.getTotalLength();
        svgPath.style.strokeDasharray = `${length}`;
        svgPath.style.strokeDashoffset = `${length}`;
      });

      // Animate strokeDashoffset from full length to 0 (drawing effect)
      animate('.dependency-path', {
        strokeDashoffset: 0,
        ease: 'inOutSine',
        duration: 1000,
        delay: (_el: unknown, i: number) => i * 250,
      });
    }
  }, [showDependencies, tasks, zoomLevel]);

  // Draw today line position
  const todayPosition = useMemo(() => {
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysFromStart = (today.getTime() - dateRange.start.getTime()) / msPerDay;

    let unitsFromStart: number;
    switch (zoomLevel) {
      case 'day':
        unitsFromStart = daysFromStart;
        break;
      case 'week':
        unitsFromStart = daysFromStart / 7;
        break;
      case 'month':
        unitsFromStart = daysFromStart / 30;
        break;
    }

    return unitsFromStart * config.columnWidth;
  }, [dateRange.start, zoomLevel, config.columnWidth]);

  return (
    <div className={cn('bg-card border border-border rounded-lg flex flex-col overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
          {/* Connection mode indicator */}
          {connectionState.isConnecting && (
            <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
              Click target node to connect • ESC to cancel
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as ZoomLevel[]).map((level) => (
            <Button
              key={level}
              variant={zoomLevel === level ? 'default' : 'outline'}
              size="xs"
              onClick={() => setZoomLevel(level)}
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          No tasks to display
        </div>
      )}

      {/* Timeline */}
      {tasks.length > 0 && (
        <div className="flex-1 overflow-auto" ref={containerRef}>
          <div className="min-w-max relative" style={{ width: `${totalWidth}px` }}>
            <GanttTimelineHeader config={config} />
            <div className="relative">
              {/* Today line */}
              {todayPosition > 0 && todayPosition < totalWidth && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-20"
                  style={{ left: `${todayPosition}px` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-primary text-primary-foreground text-[8px] font-mono uppercase tracking-wider rounded">
                    Today
                  </div>
                </div>
              )}

              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: getColumnCount(config) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-r border-border/30"
                    style={{ left: `${i * config.columnWidth}px` }}
                  />
                ))}
              </div>

              {/* Task rows - group class enables hover state for connection nodes */}
              {tasks.map((task, taskIndex) => (
                <div
                  key={task.id}
                  className="group relative border-b border-border/20 hover:bg-muted/20 transition-colors z-10"
                  style={{ height: `${config.rowHeight}px` }}
                >
                  <GanttTaskBar
                    task={task}
                    config={config}
                    onClick={onTaskClick}
                    onDragStart={handleDragStart}
                    onNodeClick={handleNodeClick}
                    isDragging={draggedTaskId === task.id}
                    isConnecting={connectionState.isConnecting}
                    isConnectionSource={connectionState.fromTaskId === task.id}
                  />
                </div>
              ))}

              {/* Dependency lines SVG layer - between grid and tasks, clickable for removal */}
              {showDependencies && (
                <svg
                  className="absolute inset-0"
                  style={{ width: totalWidth, height: totalHeight, zIndex: 5 }}
                >
                  <DependencyArrowMarker />
                  {tasks.flatMap((task, taskIndex) =>
                    (task.dependencies || []).map((depId) => {
                      const depTask = tasks.find((t) => t.id === depId);
                      const depIndex = tasks.findIndex((t) => t.id === depId);
                      if (!depTask) return null;
                      return (
                        <GanttDependencyLine
                          key={`${depId}-${task.id}`}
                          fromTask={depTask}
                          toTask={task}
                          config={config}
                          fromIndex={depIndex}
                          toIndex={taskIndex}
                          onRemove={onConnectionRemove}
                        />
                      );
                    })
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
