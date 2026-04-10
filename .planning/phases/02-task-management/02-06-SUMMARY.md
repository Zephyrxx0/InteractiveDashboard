# Plan 02-06 Summary: Z-Index Fix & Arrow Improvements

## Status: COMPLETE

## What Was Done
1. **Z-Index Fix**: SVG dependency layer z-index increased from 5 to 25 (above task nodes at z-10)
2. **Arrow Path Simplification**: Arrows now go bottom-center → top-center with max 1 turn
3. **Animation Once**: Arrows only animate on initial page load, not on task repositioning
4. **Drag Snapping**: Real-time day snapping during drag (not just on drop)
5. **Responsive Scaling**: Chart scales to container width with ResizeObserver

## Files Modified
- `src/components/features/gantt/gantt-chart.tsx` - z-index, animation ref, responsive scaling
- `src/components/features/gantt/gantt-dependency-line.tsx` - simplified path calculation
- `src/components/features/gantt/gantt-task-row.tsx` - removed sidebar, cleaner layout
- `src/hooks/use-gantt-drag.ts` - real-time day snapping
- `src/types/gantt.ts` - adjusted minimum column widths

## Key Changes

### Arrow Path (Bottom → Top)
```typescript
// Arrow from bottom-center of source to top-center of target
const fromX = fromPos.left + fromPos.width / 2;
const fromY = (fromIndex + 1) * config.rowHeight - 8;
const toX = toPos.left + toPos.width / 2;
const toY = toIndex * config.rowHeight + 8;

// Simple L-shape or straight vertical (max 1 turn)
path = `M ${fromX} ${fromY} V ${midY} H ${toX} V ${toY - arrowOffset}`;
```

### Animation Once
```typescript
const hasAnimatedRef = useRef(false);
useEffect(() => {
  if (hasAnimatedRef.current) return;
  // ... animate only on first render
  hasAnimatedRef.current = true;
}, []);
```

### Real-time Drag Snapping
```typescript
// Snap to days during drag, not just on drop
const daysToMove = Math.round(deltaX / pixelsPerDay);
if (daysToMove !== lastAppliedDaysRef.current) {
  onTaskUpdate(taskId, newStartDate, newEndDate);
}
```

## Verification
- [x] Arrows clickable for removal (z-index fix)
- [x] Arrows have max 1 turn (cleaner paths)
- [x] Arrows animate once on load only
- [x] Drag snaps smoothly to days
- [x] Chart scales responsively
- [x] Build succeeds

## Known Improvements (Future)
- Arrow routing could be smarter for edge cases
- Could add visual preview during drag

## Requirements Satisfied
- TM-05, TM-06, TM-07, TM-08 (Gantt chart interactivity)
