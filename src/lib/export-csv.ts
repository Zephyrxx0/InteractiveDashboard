import { Task } from '@/types/task';
import { ExportOptions } from '@/types/report';
import { downloadFile, formatExportDate, generateFilename, escapeCSVCell } from './export-utils';
import { isWithinInterval, parseISO } from 'date-fns';

interface CSVColumn<T> {
  header: string;
  accessor: (item: T) => unknown;
}

/**
 * Convert array of objects to CSV string.
 */
export function toCSV<T>(data: T[], columns: CSVColumn<T>[]): string {
  const headers = columns.map(col => escapeCSVCell(col.header)).join(',');
  const rows = data.map(item =>
    columns.map(col => escapeCSVCell(col.accessor(item))).join(',')
  );
  return [headers, ...rows].join('\n');
}

/**
 * Task-specific CSV column configuration.
 */
const TASK_COLUMNS: CSVColumn<Task>[] = [
  { header: 'ID', accessor: t => t.id },
  { header: 'Name', accessor: t => t.name },
  { header: 'Status', accessor: t => t.status },
  { header: 'Assignee', accessor: t => t.assignee?.name || 'Unassigned' },
  { header: 'Due Date', accessor: t => formatExportDate(t.dueDate) },
  { header: 'Created', accessor: t => formatExportDate(t.createdAt) },
  { header: 'Updated', accessor: t => formatExportDate(t.updatedAt) },
];

/**
 * Filter tasks by date range.
 */
export function filterTasksByDateRange(tasks: Task[], dateRange?: { from: Date; to: Date }): Task[] {
  if (!dateRange) return tasks;
  
  return tasks.filter(task => {
    const taskDate = task.dueDate || task.createdAt;
    if (!taskDate) return false;
    return isWithinInterval(taskDate, { start: dateRange.from, end: dateRange.to });
  });
}

/**
 * Export tasks to CSV file.
 */
export function exportTasksToCSV(tasks: Task[], options: ExportOptions = { format: 'csv' }): void {
  // Apply date filter if provided
  const filteredTasks = filterTasksByDateRange(tasks, options.dateRange);
  
  // Generate CSV content
  const csv = toCSV(filteredTasks, TASK_COLUMNS);
  
  // Generate filename
  const filename = options.filename || generateFilename('tasks_export', 'csv');
  
  // Trigger download
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Convert tasks to CSV string (for preview or API).
 */
export function tasksToCSV(tasks: Task[], options?: { dateRange?: { from: Date; to: Date } }): string {
  const filteredTasks = filterTasksByDateRange(tasks, options?.dateRange);
  return toCSV(filteredTasks, TASK_COLUMNS);
}
