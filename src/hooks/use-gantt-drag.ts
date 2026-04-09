'use client';

import { useState, useCallback, useRef } from 'react';
import { GanttTask, GanttConfig } from '@/types/gantt';
import { addDays } from 'date-fns';

interface DragState {
  isDragging: boolean;
  taskId: string | null;
  startX: number;
  originalStartDate: Date | null;
  originalEndDate: Date | null;
  lastAppliedDays: number;
}

interface UseGanttDragOptions {
  config: GanttConfig;
  onTaskUpdate: (taskId: string, startDate: Date, endDate: Date) => void;
}

/**
 * Hook for managing Gantt task drag-and-drop rescheduling.
 * Provides smooth day-snapping during drag with real-time updates.
 */
export function useGanttDrag({ config, onTaskUpdate }: UseGanttDragOptions) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    taskId: null,
    startX: 0,
    originalStartDate: null,
    originalEndDate: null,
    lastAppliedDays: 0,
  });
  
  // Use ref to track last applied days to avoid stale closure issues
  const lastAppliedDaysRef = useRef(0);

  const handleDragStart = useCallback((e: React.MouseEvent, task: GanttTask) => {
    e.preventDefault();
    lastAppliedDaysRef.current = 0;
    setDragState({
      isDragging: true,
      taskId: task.id,
      startX: e.clientX,
      originalStartDate: task.startDate,
      originalEndDate: task.endDate,
      lastAppliedDays: 0,
    });
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.taskId || !dragState.originalStartDate || !dragState.originalEndDate) return;

      const deltaX = e.clientX - dragState.startX;
      
      // Calculate pixels per day based on zoom level
      let pixelsPerDay: number;
      switch (config.zoomLevel) {
        case 'day':
          pixelsPerDay = config.columnWidth;
          break;
        case 'week':
          pixelsPerDay = config.columnWidth / 7;
          break;
        case 'month':
          pixelsPerDay = config.columnWidth / 30;
          break;
      }

      // Snap to nearest day
      const daysToMove = Math.round(deltaX / pixelsPerDay);
      
      // Only update if the day count changed (prevents excessive updates)
      if (daysToMove !== lastAppliedDaysRef.current) {
        lastAppliedDaysRef.current = daysToMove;
        
        const newStartDate = addDays(dragState.originalStartDate, daysToMove);
        const newEndDate = addDays(dragState.originalEndDate, daysToMove);
        onTaskUpdate(dragState.taskId, newStartDate, newEndDate);
      }
    },
    [dragState, config.columnWidth, config.zoomLevel, onTaskUpdate]
  );

  const handleDragEnd = useCallback(
    () => {
      // Just reset state - updates already applied during drag
      lastAppliedDaysRef.current = 0;
      setDragState({
        isDragging: false,
        taskId: null,
        startX: 0,
        originalStartDate: null,
        originalEndDate: null,
        lastAppliedDays: 0,
      });
    },
    []
  );

  return {
    isDragging: dragState.isDragging,
    draggedTaskId: dragState.taskId,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
