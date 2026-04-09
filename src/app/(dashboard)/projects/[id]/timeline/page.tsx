'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { GanttChart, GanttTaskSheet } from '@/components/features/gantt';
import { GanttTask } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addDays } from 'date-fns';

/**
 * Template definitions for quick task creation.
 * Each template creates a task with predefined properties.
 */
interface TaskTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultDuration: number; // days
  defaultStatus: GanttTask['status'];
}

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'milestone',
    name: 'Milestone',
    icon: 'flag',
    description: 'A key checkpoint or deliverable',
    defaultDuration: 1,
    defaultStatus: 'todo',
  },
  {
    id: 'sprint',
    name: 'Sprint',
    icon: 'sprint',
    description: '2-week development sprint',
    defaultDuration: 14,
    defaultStatus: 'todo',
  },
  {
    id: 'review',
    name: 'Review',
    icon: 'rate_review',
    description: 'Code or design review period',
    defaultDuration: 3,
    defaultStatus: 'todo',
  },
  {
    id: 'testing',
    name: 'Testing Phase',
    icon: 'bug_report',
    description: 'QA and testing period',
    defaultDuration: 5,
    defaultStatus: 'todo',
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: 'rocket_launch',
    description: 'Release and deployment task',
    defaultDuration: 2,
    defaultStatus: 'todo',
  },
  {
    id: 'meeting',
    name: 'Meeting',
    icon: 'groups',
    description: 'Team meeting or sync',
    defaultDuration: 1,
    defaultStatus: 'todo',
  },
];

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

/** Generates a unique task ID */
function generateTaskId(): string {
  return `T-${String(Date.now()).slice(-6)}`;
}

/**
 * Timeline page displaying project tasks in a Gantt chart visualization.
 * 
 * Features:
 * - Interactive Gantt chart with zoom controls (day/week/month)
 * - Task details slide-out panel for editing
 * - Template dropdown for quick task creation
 * - Error state with retry functionality
 * - Empty state with guidance to add tasks
 * - Task update handler for drag-drop rescheduling
 * - Dependency connection management
 * 
 * @returns {JSX.Element} The rendered timeline page
 */
export default function TimelinePage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [tasks, setTasks] = useState<GanttTask[]>(MOCK_GANTT_TASKS);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
   * Handles adding a dependency connection between two tasks.
   * 
   * @param {string} fromTaskId - The source task ID (dependency)
   * @param {string} toTaskId - The target task ID (dependent)
   */
  const handleConnectionAdd = (fromTaskId: string, toTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === toTaskId) {
        const deps = t.dependencies || [];
        if (!deps.includes(fromTaskId)) {
          return { ...t, dependencies: [...deps, fromTaskId], updatedAt: new Date() };
        }
      }
      return t;
    }));
  };

  /**
   * Handles removing a dependency connection between two tasks.
   * 
   * @param {string} fromTaskId - The source task ID (dependency)
   * @param {string} toTaskId - The target task ID (dependent)
   */
  const handleConnectionRemove = (fromTaskId: string, toTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === toTaskId && t.dependencies) {
        return { 
          ...t, 
          dependencies: t.dependencies.filter(id => id !== fromTaskId),
          updatedAt: new Date() 
        };
      }
      return t;
    }));
  };

  /**
   * Handles task click events - opens task details panel.
   * 
   * @param {GanttTask} task - The clicked task
   */
  const handleTaskClick = (task: GanttTask) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  /**
   * Handles task deletion.
   * Also removes this task from any dependencies.
   * 
   * @param {string} taskId - ID of the task to delete
   */
  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => {
      // Remove the task and clean up any references to it in dependencies
      return prev
        .filter(t => t.id !== taskId)
        .map(t => ({
          ...t,
          dependencies: t.dependencies?.filter(id => id !== taskId),
        }));
    });
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
   * Creates a new task from a template.
   * 
   * @param {TaskTemplate} template - The template to use
   */
  const handleAddFromTemplate = (template: TaskTemplate) => {
    const now = new Date();
    const startDate = addDays(now, 1); // Start tomorrow
    const endDate = addDays(startDate, template.defaultDuration);
    
    const newTask: GanttTask = {
      id: generateTaskId(),
      name: template.name,
      description: template.description,
      status: template.defaultStatus,
      startDate,
      endDate,
      dueDate: endDate,
      progress: 0,
      createdAt: now,
      updatedAt: now,
      projectId,
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Open the sheet to edit the new task
    setSelectedTask(newTask);
    setIsSheetOpen(true);
  };

  /**
   * Creates a blank new task.
   */
  const handleAddBlankTask = () => {
    const now = new Date();
    const startDate = addDays(now, 1);
    const endDate = addDays(startDate, 7);
    
    const newTask: GanttTask = {
      id: generateTaskId(),
      name: 'New Task',
      status: 'todo',
      startDate,
      endDate,
      dueDate: endDate,
      progress: 0,
      createdAt: now,
      updatedAt: now,
      projectId,
    };
    
    setTasks(prev => [...prev, newTask]);
    setSelectedTask(newTask);
    setIsSheetOpen(true);
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
            onAction={handleAddBlankTask}
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
          <div className="flex items-center gap-2">
            {/* Templates Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[16px] mr-2">widgets</span>
                  Templates
                  <span className="material-symbols-outlined text-[14px] ml-1">expand_more</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-mono text-xs uppercase tracking-wider">
                  Quick Add from Template
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TASK_TEMPLATES.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleAddFromTemplate(template)}
                    className="cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-3 text-muted-foreground">
                      {template.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.defaultDuration} day{template.defaultDuration !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Task Button */}
            <Button 
              onClick={handleAddBlankTask}
              className="font-mono text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[16px] mr-2">add</span>
              Add Task
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 p-6 grid-bg overflow-hidden">
        <GanttChart
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskUpdate={handleTaskUpdate}
          onConnectionAdd={handleConnectionAdd}
          onConnectionRemove={handleConnectionRemove}
          className="h-full"
        />
      </div>

      {/* Task Details Sheet */}
      <GanttTaskSheet
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
}
