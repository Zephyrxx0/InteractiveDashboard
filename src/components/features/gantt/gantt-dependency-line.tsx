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

  // The arrow should connect directly to the start node of the toTask
  // and emanate from the end node of the fromTask.
  
  // The nodes are offset by +/- 1.5 of their parent, and they are circles of radius 1.5.
  // Instead of drawing through the bars, let's draw strictly between the right edge of fromX and left edge of toX.

  const padding = 12; // Gap from the task nodes
  const midX = Math.min(fromX + padding, toX - padding);

  let path: string;
  if (toX >= fromX + padding * 2) {
    // Normal case: dependency flows left to right
    path = `M ${fromX} ${fromY} H ${fromX + padding} V ${toY} H ${toX - 2}`; // -2 for arrowhead offset
  } else {
    // Reverse case: target starts before source ends
    // Route around using a wider elbow
    const elbowY = fromY > toY ? fromY - config.rowHeight / 2 : fromY + config.rowHeight / 2;
    path = `M ${fromX} ${fromY} H ${fromX + padding} V ${elbowY} H ${toX - padding} V ${toY} H ${toX - 2}`;
  }

  return (
    <g className="dependency-line">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-muted-foreground dependency-path"
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
