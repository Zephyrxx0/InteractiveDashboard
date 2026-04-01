'use client';

import { GanttTask, GanttConfig } from '@/types/gantt';
import { differenceInDays } from 'date-fns';

interface GanttDependencyLineProps {
  fromTask: GanttTask;
  toTask: GanttTask;
  config: GanttConfig;
  fromIndex: number;
  toIndex: number;
}

export function GanttDependencyLine({
  fromTask,
  toTask,
  config,
  fromIndex,
  toIndex,
}: GanttDependencyLineProps) {
  // Calculate positions based on zoom level
  const fromDays = differenceInDays(fromTask.endDate, config.startDate);
  const toDays = differenceInDays(toTask.startDate, config.startDate);

  // Convert days to pixels based on zoom level
  let fromX: number;
  let toX: number;

  switch (config.zoomLevel) {
    case 'day':
      fromX = fromDays * config.columnWidth;
      toX = toDays * config.columnWidth;
      break;
    case 'week':
      fromX = (fromDays / 7) * config.columnWidth;
      toX = (toDays / 7) * config.columnWidth;
      break;
    case 'month':
      fromX = (fromDays / 30) * config.columnWidth;
      toX = (toDays / 30) * config.columnWidth;
      break;
  }

  const fromY = (fromIndex + 0.5) * config.rowHeight;
  const toY = (toIndex + 0.5) * config.rowHeight;

  // Draw path with elbow (right angle) routing
  // Step 1: Go right from fromX
  // Step 2: Go vertical to toY level
  // Step 3: Go right to toX
  const padding = 8; // Small gap from task bars
  const midX = Math.min(fromX + padding, toX - padding);

  // Create path with orthogonal routing
  let path: string;
  if (toX >= fromX) {
    // Normal case: dependency flows left to right
    path = `M ${fromX} ${fromY} H ${fromX + padding} V ${toY} H ${toX}`;
  } else {
    // Reverse case: target starts before source ends
    // Route around using a wider elbow
    const elbowY = fromY > toY ? fromY - config.rowHeight / 2 : fromY + config.rowHeight / 2;
    path = `M ${fromX} ${fromY} H ${fromX + padding} V ${elbowY} H ${toX - padding} V ${toY} H ${toX}`;
  }

  return (
    <g className="dependency-line">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-muted-foreground"
        markerEnd="url(#arrowhead)"
      />
    </g>
  );
}

// Arrow marker definition (add to SVG defs)
export function DependencyArrowMarker() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3.5, 0 7"
          fill="currentColor"
          className="text-muted-foreground"
        />
      </marker>
    </defs>
  );
}
