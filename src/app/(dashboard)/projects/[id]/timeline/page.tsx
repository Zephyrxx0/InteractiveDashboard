'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { GanttChart } from '@/components/features/gantt';
import { GanttTask } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Mock task data for demonstration purposes.
 * In production, this would be fetched from Firebase based on projectId.
 * 
 * @constant {GanttTask[]}
 */
const MOCK_GANTT_TASKS: GanttTask[] = [
  {
    id: 'T-001',
    name: 'Project Planning',
    status: 'done',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-07'),
    dueDate: new Date('2026-03-07'),
    progress: 100,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-07'),
  },
  {
    id: 'T-002',
    name: 'Design Phase',
    status: 'in-progress',
    startDate: new Date('2026-03-05'),
    endDate: new Date('2026-03-15'),
    dueDate: new Date('2026-03-15'),
    progress: 60,
    dependencies: ['T-001'],
    assignee: { id: '1', name: 'Sarah J.', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: 'T-003',
    name: 'Development Sprint 1',
    status: 'todo',
    startDate: new Date('2026-03-12'),
    endDate: new Date('2026-03-26'),
    dueDate: new Date('2026-03-26'),
    progress: 0,
    dependencies: ['T-002'],
    assignee: { id: '2', name: 'Mike R.', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: 'T-004',
    name: 'Development Sprint 2',
    status: 'todo',
    startDate: new Date('2026-03-26'),
    endDate: new Date('2026-04-10'),
    dueDate: new Date('2026-04-10'),
    progress: 0,
    dependencies: ['T-003'],
    assignee: { id: '3', name: 'Lisa K.', avatarUrl: 'https://i.pravatar.cc/150?u=lisa' },
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: 'T-005',
    name: 'QA Testing',
    status: 'blocked',
    startDate: new Date('2026-04-08'),
    endDate: new Date('2026-04-18'),
    dueDate: new Date('2026-04-18'),
    progress: 0,
    dependencies: ['T-003', 'T-004'],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: 'T-006',
    name: 'Deployment',
    status: 'todo',
    startDate: new Date('2026-04-18'),
    endDate: new Date('2026-04-22'),
    dueDate: new Date('2026-04-22'),
    progress: 0,
    dependencies: ['T-005'],
    assignee: { id: '4', name: 'Tom B.', avatarUrl: 'https://i.pravatar.cc/150?u=tom' },
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
];

/**
 * Timeline page displaying project tasks in a Gantt chart visualization.
 * 
 * Features:
 * - Interactive Gantt chart with zoom controls (day/week/month)
 * - Task details on hover via tooltips
 * - Error state with retry functionality
 * - Empty state with guidance to add tasks
 * - Task update handler for drag-drop rescheduling
 * 
 * @returns {JSX.Element} The rendered timeline page
 */
export default function TimelinePage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [tasks, setTasks] = useState<GanttTask[]>(MOCK_GANTT_TASKS);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Handles updates to a task's properties (e.g., from drag-drop rescheduling).
   * 
   * @param {string} taskId - ID of the task to update
   * @param {Partial<GanttTask>} updates - Properties to update
   */
  const handleTaskUpdate = (taskId: string, updates: Partial<GanttTask>) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
    ));
  };

  /**
   * Handles task click events - opens task details panel/modal.
   * 
   * @param {GanttTask} task - The clicked task
   */
  const handleTaskClick = (task: GanttTask) => {
    // TODO: Open task details panel/modal
    console.log('Task clicked:', task.id, task.name);
  };

  /**
   * Simulates loading tasks - used for retry functionality.
   * In production, this would fetch from Firebase.
   */
  const handleRetry = () => {
    setError(null);
    // In production: refetch tasks from Firebase
    setTasks(MOCK_GANTT_TASKS);
  };

  /**
   * Handles adding a new task - placeholder for task creation flow.
   */
  const handleAddTask = () => {
    // TODO: Open task creation modal
    console.log('Add task clicked for project:', projectId);
  };

  // Error state - shows when loading/fetching fails
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader 
          title="Timeline" 
          subtitle="Project schedule visualization" 
        />
        <div className="flex-1 p-6 grid-bg">
          <EmptyState
            icon="error"
            title="Unable to load timeline"
            description={error.message || 'An unexpected error occurred while loading the timeline.'}
            actionLabel="Retry"
            onAction={handleRetry}
          />
        </div>
      </div>
    );
  }

  // Empty state - shows when project has no scheduled tasks
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader 
          title="Timeline" 
          subtitle="Project schedule visualization" 
        />
        <div className="flex-1 p-6 grid-bg">
          <EmptyState
            icon="calendar_month"
            title="No tasks scheduled"
            description="Add tasks with start and end dates to see them on the timeline. Tasks will be displayed as bars that can be dragged to reschedule."
            actionLabel="Add Task"
            onAction={handleAddTask}
          />
        </div>
      </div>
    );
  }

  // Main timeline view with GanttChart
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Timeline"
        subtitle="Project schedule visualization"
        actions={
          <Button 
            onClick={handleAddTask}
            className="font-mono text-xs uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[16px] mr-2">add</span>
            Add Task
          </Button>
        }
      />
      
      <div className="flex-1 p-6 grid-bg overflow-hidden">
        <GanttChart
          tasks={tasks}
          onTaskClick={handleTaskClick}
          className="h-full"
        />
      </div>
    </div>
  );
}
