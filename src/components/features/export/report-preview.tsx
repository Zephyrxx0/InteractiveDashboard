'use client';

import { useMemo } from 'react';
import { Task } from '@/types/task';
import { TaskReportData } from '@/types/report';
import { formatExportDate } from '@/lib/export-utils';
import { isBefore } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportPreviewProps {
  tasks: Task[];
  dateRange?: { from: Date; to: Date };
  className?: string;
}

export function ReportPreview({ tasks, dateRange, className }: ReportPreviewProps) {
  const data = useMemo((): TaskReportData => {
    const now = new Date();
    
    // Filter by date range if provided
    let filteredTasks = tasks;
    if (dateRange) {
      filteredTasks = tasks.filter(t => {
        const taskDate = t.dueDate || t.createdAt;
        if (!taskDate) return false;
        return taskDate >= dateRange.from && taskDate <= dateRange.to;
      });
    }

    return {
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter(t => t.status === 'done').length,
      overdueTasks: filteredTasks.filter(t => 
        t.status !== 'done' && t.dueDate && isBefore(t.dueDate, now)
      ).length,
      tasksByStatus: filteredTasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      tasksByAssignee: Object.entries(
        filteredTasks.reduce((acc, t) => {
          const name = t.assignee?.name || 'Unassigned';
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      tasks: filteredTasks.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status,
        assignee: t.assignee?.name || 'Unassigned',
        dueDate: formatExportDate(t.dueDate),
        createdAt: formatExportDate(t.createdAt),
      })),
    };
  }, [tasks, dateRange]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-3xl font-bold">{data.totalTasks}</p>
          <p className="text-sm text-muted-foreground">Total Tasks</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-3xl font-bold text-success">{data.completedTasks}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-3xl font-bold text-destructive">{data.overdueTasks}</p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-card border border-border p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Tasks by Status</h3>
        <div className="flex gap-4">
          {Object.entries(data.tasksByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span className="text-sm font-medium">{status}:</span>
              <span className="text-sm text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Preview Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Task Preview</h3>
          <p className="text-xs text-muted-foreground">First 10 of {data.tasks.length} tasks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-mono text-xs uppercase">Name</th>
                <th className="text-left p-3 font-mono text-xs uppercase">Status</th>
                <th className="text-left p-3 font-mono text-xs uppercase">Assignee</th>
                <th className="text-left p-3 font-mono text-xs uppercase">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.slice(0, 10).map(task => (
                <tr key={task.id} className="border-t border-border">
                  <td className="p-3">{task.name}</td>
                  <td className="p-3">{task.status}</td>
                  <td className="p-3">{task.assignee}</td>
                  <td className="p-3">{task.dueDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
