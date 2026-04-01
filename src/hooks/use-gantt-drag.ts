'use client';

import { useState, useCallback } from 'react';
import { GanttTask, GanttConfig } from '@/types/gantt';
import { addDays } from 'date-fns';

interface DragState {
  isDragging: boolean;
  taskId: string | null;
  startX: number;
  originalStartDate: Date | null;
  originalEndDate: Date | null;
}

interface UseGanttDragOptions {
  config: GanttConfig;
  onTaskUpdate: (taskId: string, startDate: Date, endDate: Date) => void;
}

export function useGanttDrag({ config, onTaskUpdate }: UseGanttDragOptions) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    taskId: null,
    startX: 0,
    originalStartDate: null,
    originalEndDate: null,
  });

  const handleDragStart = useCallback((e: React.MouseEvent, task: GanttTask) => {
    e.preventDefault();
    setDragState({
      isDragging: true,
      taskId: task.id,
      startX: e.clientX,
      originalStartDate: task.startDate,
      originalEndDate: task.endDate,
    });
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.taskId || !dragState.originalStartDate || !dragState.originalEndDate) return;

      const deltaX = e.clientX - dragState.startX;
      const daysToMove = Math.round(deltaX / config.columnWidth);

      let daysPerColumn = 1;
      switch (config.zoomLevel) {
        case 'week': daysPerColumn = 7; break;
        case 'month': daysPerColumn = 30; break;
      }

      const actualDaysToMove = daysToMove * daysPerColumn;
      
      // We don't dispatch updates on every move to avoid jumping layout,
      // but we could use this for a preview shadow
    },
    [dragState, config.columnWidth, config.zoomLevel]
  );

  const handleDragEnd = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.taskId || !dragState.originalStartDate || !dragState.originalEndDate) {
        setDragState({ isDragging: false, taskId: null, startX: 0, originalStartDate: null, originalEndDate: null });
        return;
      }

      const deltaX = e.clientX - dragState.startX;
      const columnsToMove = Math.round(deltaX / config.columnWidth);

      let daysPerColumn = 1;
      switch (config.zoomLevel) {
        case 'week': daysPerColumn = 7; break;
        case 'month': daysPerColumn = 30; break;
      }

      const actualDaysToMove = columnsToMove * daysPerColumn;

      if (actualDaysToMove !== 0) {
        const newStartDate = addDays(dragState.originalStartDate, actualDaysToMove);
        const newEndDate = addDays(dragState.originalEndDate, actualDaysToMove);
        onTaskUpdate(dragState.taskId, newStartDate, newEndDate);
      }

      setDragState({
        isDragging: false,
        taskId: null,
        startX: 0,
        originalStartDate: null,
        originalEndDate: null,
      });
    },
    [dragState, config.columnWidth, config.zoomLevel, onTaskUpdate]
  );

  return {
    isDragging: dragState.isDragging,
    draggedTaskId: dragState.taskId,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
