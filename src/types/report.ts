export type ExportFormat = 'csv' | 'pdf' | 'xlsx';

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    from: Date;
    to: Date;
  };
  includeFields?: string[];
  filename?: string;
}

export interface ReportConfig {
  title: string;
  subtitle?: string;
  generatedAt: Date;
  dateRange?: {
    from: Date;
    to: Date;
  };
  filters?: Record<string, string>;
}

export interface ReportSection {
  title: string;
  type: 'table' | 'chart' | 'summary';
  data: unknown;
}

export interface TaskReportData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Array<{ name: string; count: number }>;
  tasks: Array<{
    id: string;
    name: string;
    status: string;
    assignee: string;
    dueDate: string;
    createdAt: string;
  }>;
}
