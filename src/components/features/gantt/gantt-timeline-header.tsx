'use client';

import { GanttConfig, ZoomLevel, getColumnCount } from '@/types/gantt';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface GanttTimelineHeaderProps {
  config: GanttConfig;
}

// Generate date labels based on zoom level
function generateDateLabels(config: GanttConfig): { date: Date; label: string }[] {
  const { startDate, zoomLevel } = config;
  const columnCount = getColumnCount(config);
  const labels: { date: Date; label: string }[] = [];

  for (let i = 0; i < columnCount; i++) {
    let date: Date;
    let label: string;

    switch (zoomLevel) {
      case 'day':
        date = addDays(startDate, i);
        label = format(date, 'MMM d');
        break;
      case 'week':
        date = addWeeks(startDate, i);
        const weekEnd = addDays(date, 6);
        label = `${format(date, 'MMM d')}-${format(weekEnd, 'd')}`;
        break;
      case 'month':
        date = addMonths(startDate, i);
        label = format(date, 'MMMM yyyy');
        break;
    }

    labels.push({ date, label });
  }

  return labels;
}

// Check if date is today
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Check if week contains today
function isCurrentWeek(weekStart: Date): boolean {
  const today = new Date();
  const weekEnd = addDays(weekStart, 6);
  return today >= weekStart && today <= weekEnd;
}

// Check if month contains today
function isCurrentMonth(monthStart: Date): boolean {
  const today = new Date();
  return (
    monthStart.getMonth() === today.getMonth() &&
    monthStart.getFullYear() === today.getFullYear()
  );
}

export function GanttTimelineHeader({ config }: GanttTimelineHeaderProps) {
  const labels = generateDateLabels(config);
  const { columnWidth, zoomLevel } = config;

  const isCurrentPeriod = (date: Date): boolean => {
    switch (zoomLevel) {
      case 'day':
        return isToday(date);
      case 'week':
        return isCurrentWeek(date);
      case 'month':
        return isCurrentMonth(date);
    }
  };

  return (
    <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
      {labels.map(({ date, label }, index) => (
        <div
          key={index}
          className={cn(
            'flex-shrink-0 px-1 py-2 text-center border-r border-border/50',
            isCurrentPeriod(date) && 'bg-primary/10 font-semibold'
          )}
          style={{ width: `${columnWidth}px` }}
        >
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
