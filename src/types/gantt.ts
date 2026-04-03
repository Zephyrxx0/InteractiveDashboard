// src/types/gantt.ts
import { Task } from './task';

export type ZoomLevel = 'day' | 'week' | 'month';

export interface GanttTask extends Task {
  startDate: Date;
  endDate: Date;
  progress?: number; // 0-100
  dependencies?: string[]; // Task IDs this depends on
}

export interface GanttConfig {
  zoomLevel: ZoomLevel;
  startDate: Date;
  endDate: Date;
  rowHeight: number; // pixels
  columnWidth: number; // pixels per unit (day/week/month)
}

export interface GanttViewport {
  visibleStart: Date;
  visibleEnd: Date;
  scrollLeft: number;
}

// Calculate column count based on zoom level
export function getColumnCount(config: GanttConfig): number {
  const { startDate, endDate, zoomLevel } = config;
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  switch (zoomLevel) {
    case 'day':
      return Math.ceil(diffDays);
    case 'week':
      return Math.ceil(diffDays / 7);
    case 'month':
      return Math.ceil(diffDays / 30);
  }
}

// Column width defaults per zoom level (minimum values, will scale up to fit container)
export const ZOOM_COLUMN_WIDTHS: Record<ZoomLevel, number> = {
  day: 32,    // Smaller for more days visible
  week: 80,   // Moderate for week view
  month: 100, // Wider for month overview
};

// Calculate task position and width in pixels
export function calculateTaskPosition(
  task: GanttTask,
  config: GanttConfig
): { left: number; width: number } {
  const { startDate: chartStart, columnWidth, zoomLevel } = config;
  const taskStart = task.startDate.getTime();
  const taskEnd = task.endDate.getTime();
  const chartStartTime = chartStart.getTime();

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromStart = (taskStart - chartStartTime) / msPerDay;
  const durationDays = (taskEnd - taskStart) / msPerDay;

  let unitsFromStart: number;
  let durationUnits: number;

  switch (zoomLevel) {
    case 'day':
      unitsFromStart = daysFromStart;
      durationUnits = durationDays;
      break;
    case 'week':
      unitsFromStart = daysFromStart / 7;
      durationUnits = durationDays / 7;
      break;
    case 'month':
      unitsFromStart = daysFromStart / 30;
      durationUnits = durationDays / 30;
      break;
  }

  return {
    left: unitsFromStart * columnWidth,
    width: Math.max(durationUnits * columnWidth, columnWidth / 2), // Minimum width
  };
}
