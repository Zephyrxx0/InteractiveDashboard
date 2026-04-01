'use client';

import { useState, useMemo, useRef } from 'react';
import { GanttTask, GanttConfig, ZoomLevel, ZOOM_COLUMN_WIDTHS, getColumnCount } from '@/types/gantt';
import { GanttTaskBar } from './gantt-task-bar';
import { GanttTimelineHeader } from './gantt-timeline-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addDays, subDays, min, max } from 'date-fns';

interface GanttChartProps {
  tasks: GanttTask[];
  startDate?: Date;
  endDate?: Date;
  onTaskClick?: (task: GanttTask) => void;
  className?: string;
}

export function GanttChart({
  tasks,
  startDate: propStartDate,
  endDate: propEndDate,
  onTaskClick,
  className,
}: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
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
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
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

              {/* Task rows */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative border-b border-border/20 hover:bg-muted/20 transition-colors"
                  style={{ height: `${config.rowHeight}px` }}
                >
                  <GanttTaskBar task={task} config={config} onClick={onTaskClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
