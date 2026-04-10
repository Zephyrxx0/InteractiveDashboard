'use client';

import { GanttTask, GanttConfig, calculateTaskPosition } from '@/types/gantt';

interface GanttDependencyLineProps {
  fromTask: GanttTask;
  toTask: GanttTask;
  config: GanttConfig;
  fromIndex: number;
  toIndex: number;
  onRemove?: (fromTaskId: string, toTaskId: string) => void;
}

/**
 * Renders an SVG dependency arrow between two tasks.
 * Arrow goes from bottom-center of source task to top-center of target task.
 * Simple path with at most one turn (L-shape or straight vertical).
 */
export function GanttDependencyLine({
  fromTask,
  toTask,
  config,
  fromIndex,
  toIndex,
  onRemove,
}: GanttDependencyLineProps) {
  const fromPos = calculateTaskPosition(fromTask, config);
  const toPos = calculateTaskPosition(toTask, config);

  // Arrow starts from bottom-center of source task
  const fromX = fromPos.left + fromPos.width / 2;
  const fromY = (fromIndex + 1) * config.rowHeight - 8; // Bottom of row with small offset
  
  // Arrow ends at top-center of target task
  const toX = toPos.left + toPos.width / 2;
  const toY = toIndex * config.rowHeight + 8; // Top of row with small offset
  
  // Arrowhead offset
  const arrowOffset = 6;

  let path: string;

  if (fromIndex < toIndex) {
    // Normal case: source is above target
    // Simple L-shape: go down, then horizontal to target
    const midY = fromY + (toY - fromY) / 2;
    
    if (Math.abs(fromX - toX) < 10) {
      // Nearly aligned - straight vertical line
      path = `M ${fromX} ${fromY} V ${toY - arrowOffset}`;
    } else {
      // L-shape path: down, horizontal, down
      path = `M ${fromX} ${fromY} V ${midY} H ${toX} V ${toY - arrowOffset}`;
    }
  } else {
    // Reverse case: source is below or same row as target
    // Go down first, then route around
    const routeY = (Math.max(fromIndex, toIndex) + 1) * config.rowHeight + 16;
    path = `M ${fromX} ${fromY} V ${routeY} H ${toX} V ${toY - arrowOffset}`;
  }

  return (
    <g 
      className="dependency-line group/line cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onRemove?.(fromTask.id, toTask.id);
      }}
    >
      {/* Invisible wider hit area for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="pointer-events-auto"
      />
      {/* Visible line with smooth corners */}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-muted-foreground/60 dependency-path transition-colors duration-200 group-hover/line:text-destructive group-hover/line:stroke-[3]"
        markerEnd="url(#arrowhead)"
      />
      {/* Hover tooltip */}
      <title>Click to remove: {fromTask.name} → {toTask.name}</title>
    </g>
  );
}

/** SVG marker definition for arrowheads - must be included in parent SVG defs */
export function DependencyArrowMarker() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="8"
        markerHeight="6"
        refX="4"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon
          points="0 0, 8 3, 0 6"
          fill="currentColor"
          className="text-muted-foreground/60"
        />
      </marker>
    </defs>
  );
}
