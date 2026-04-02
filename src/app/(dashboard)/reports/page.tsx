'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { ExportDialog } from '@/components/features/export';
import { ReportPreview } from '@/components/features/export/report-preview';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exportTasksToCSV } from '@/lib/export-csv';
import { exportTasksToPDF } from '@/lib/export-pdf';
import { Task } from '@/types/task';
import { ExportOptions } from '@/types/report';

// Mock tasks - replace with real data
const MOCK_TASKS: Task[] = [
  {
    id: 'T-001',
    name: 'Complete project documentation',
    status: 'done',
    assignee: { id: '1', name: 'Sarah J.', avatarUrl: '' },
    dueDate: new Date('2026-03-15'),
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 'T-002',
    name: 'Review design mockups',
    status: 'in-progress',
    assignee: { id: '2', name: 'Mike T.', avatarUrl: '' },
    dueDate: new Date('2026-03-28'),
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-20'),
  },
  {
    id: 'T-003',
    name: 'Fix authentication bugs',
    status: 'blocked',
    assignee: { id: '1', name: 'Sarah J.', avatarUrl: '' },
    dueDate: new Date('2026-03-20'),
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-03-22'),
  },
  {
    id: 'T-004',
    name: 'Deploy to staging',
    status: 'todo',
    dueDate: new Date('2026-04-01'),
    createdAt: new Date('2026-03-22'),
    updatedAt: new Date('2026-03-22'),
  },
  // Add more mock tasks...
];

export default function ReportsPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const exportOptions = {
        ...options,
        dateRange,
      };

      if (options.format === 'csv') {
        exportTasksToCSV(tasks, exportOptions);
      } else if (options.format === 'pdf') {
        await exportTasksToPDF(tasks, {
          ...exportOptions,
          template: options.template || 'summary',
          title: 'Task Report',
          subtitle: 'Generated from Interactive Dashboard',
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = async (format: 'csv' | 'pdf') => {
    await handleExport({ format, dateRange, template: format === 'pdf' ? 'summary' : undefined });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports"
        subtitle="Generate and export project reports"
        actions={
          <ExportDialog
            trigger={
              <Button className="font-mono text-xs uppercase">
                <span className="material-symbols-outlined text-[16px] mr-2">download</span>
                Export
              </Button>
            }
            title="Export Tasks"
            formats={['csv', 'pdf']}
            onExport={handleExport}
            isExporting={isExporting}
          />
        }
      />

      <div className="flex-1 p-6 grid-bg overflow-auto">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Date Range:</span>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange as any}
                presets={[
                  { label: 'Last 7 days', days: 7 },
                  { label: 'Last 30 days', days: 30 },
                  { label: 'Last 90 days', days: 90 },
                ]}
              />
              {dateRange && (
                <Button variant="ghost" size="sm" onClick={() => setDateRange(undefined)}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Quick Export Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleQuickExport('csv')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-primary">table</span>
                  <div>
                    <CardTitle className="text-lg">CSV Export</CardTitle>
                    <CardDescription>Download task data as spreadsheet</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export all task data including status, assignees, and dates. 
                  Compatible with Excel, Google Sheets, and other spreadsheet apps.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleQuickExport('pdf')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-destructive">picture_as_pdf</span>
                  <div>
                    <CardTitle className="text-lg">PDF Report</CardTitle>
                    <CardDescription>Generate formatted summary report</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Professional PDF report with summary statistics, task breakdown, 
                  and detailed task list. Perfect for sharing with stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Report Preview</h2>
            <ReportPreview tasks={tasks} dateRange={dateRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
