// src/lib/export-pdf.ts
'use client';

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Task } from '@/types/task';
import { ReportConfig, TaskReportData, ExportOptions } from '@/types/report';
import { SummaryReportDocument, DetailedReportDocument } from '@/components/features/export/pdf-report-template';
import { downloadFile, formatExportDate, generateFilename } from './export-utils';
import { filterTasksByDateRange } from './export-csv';
import { isBefore } from 'date-fns';

type ReportTemplate = 'summary' | 'detailed';

/**
 * Prepare task data for PDF report.
 */
function prepareTaskReportData(tasks: Task[]): TaskReportData {
  const now = new Date();
  
  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    overdueTasks: tasks.filter(t => 
      t.status !== 'done' && t.dueDate && isBefore(t.dueDate, now)
    ).length,
    tasksByStatus: tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    tasksByAssignee: Object.entries(
      tasks.reduce((acc, t) => {
        const name = t.assignee?.name || 'Unassigned';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, count]) => ({ name, count })),
    tasks: tasks.map(t => ({
      id: t.id,
      name: t.name,
      status: t.status,
      assignee: t.assignee?.name || 'Unassigned',
      dueDate: formatExportDate(t.dueDate),
      createdAt: formatExportDate(t.createdAt),
    })),
  };
}

interface PDFExportOptions extends ExportOptions {
  template?: ReportTemplate;
  title?: string;
  subtitle?: string;
}

/**
 * Generate and download PDF report.
 * Runs client-side to avoid server blocking.
 */
export async function exportTasksToPDF(
  tasks: Task[],
  options: PDFExportOptions = { format: 'pdf' }
): Promise<void> {
  // Filter tasks if date range provided
  const filteredTasks = filterTasksByDateRange(tasks, options.dateRange);
  
  // Prepare report config
  const config: ReportConfig = {
    title: options.title || 'Task Report',
    subtitle: options.subtitle,
    generatedAt: new Date(),
    dateRange: options.dateRange,
  };

  // Prepare data
  const data = prepareTaskReportData(filteredTasks);

  // Select template
  const template = options.template || 'summary';
  const DocumentComponent = template === 'detailed' 
    ? DetailedReportDocument 
    : SummaryReportDocument;

  // Generate PDF blob (client-side)
  const element = React.createElement(DocumentComponent, { config, data });
  const blob = await pdf(element as any).toBlob();

  // Download
  const filename = options.filename || generateFilename('task_report', 'pdf');
  downloadFile(blob, filename, 'application/pdf');
}

/**
 * Generate PDF blob without downloading (for preview or API).
 */
export async function generatePDFReport(
  tasks: Task[],
  config: ReportConfig,
  template: ReportTemplate = 'summary'
): Promise<Blob> {
  const data = prepareTaskReportData(tasks);
  const DocumentComponent = template === 'detailed' 
    ? DetailedReportDocument 
    : SummaryReportDocument;
  
  const element = React.createElement(DocumentComponent, { config, data });
  return pdf(element as any).toBlob();
}
