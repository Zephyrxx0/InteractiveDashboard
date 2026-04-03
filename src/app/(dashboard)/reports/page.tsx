'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { ExportDialog } from '@/components/features/export';
import { ReportPreview } from '@/components/features/export/report-preview';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { exportTasksToCSV } from '@/lib/export-csv';
import { exportTasksToPDF } from '@/lib/export-pdf';
import { Task } from '@/types/task';
import { ExportOptions } from '@/types/report';
import { Plus, MoreHorizontal, Pencil, Copy, Trash, FileText } from 'lucide-react';

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
];

// Saved reports mock data
interface SavedReport {
  id: string;
  name: string;
  type: 'project-summary' | 'task-progress' | 'team-performance' | 'timeline-analysis';
  createdAt: Date;
  lastRun?: Date;
}

const REPORT_TYPES = [
  { value: 'project-summary', label: 'Project Summary' },
  { value: 'task-progress', label: 'Task Progress' },
  { value: 'team-performance', label: 'Team Performance' },
  { value: 'timeline-analysis', label: 'Timeline Analysis' },
];

const INITIAL_REPORTS: SavedReport[] = [
  { id: '1', name: 'Q1 Project Summary', type: 'project-summary', createdAt: new Date('2026-01-15'), lastRun: new Date('2026-03-01') },
  { id: '2', name: 'Weekly Task Progress', type: 'task-progress', createdAt: new Date('2026-02-20'), lastRun: new Date('2026-03-25') },
];

export default function ReportsPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(INITIAL_REPORTS);
  const [newReportName, setNewReportName] = useState('');
  const [newReportType, setNewReportType] = useState<string>('');

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

  const handleCreateReport = () => {
    if (!newReportName || !newReportType) return;
    
    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: newReportName,
      type: newReportType as SavedReport['type'],
      createdAt: new Date(),
    };
    
    setSavedReports(prev => [...prev, newReport]);
    setNewReportName('');
    setNewReportType('');
    setShowCreateModal(false);
  };

  const handleDeleteReport = (id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
  };

  const handleDuplicateReport = (report: SavedReport) => {
    const duplicate: SavedReport = {
      ...report,
      id: Date.now().toString(),
      name: `${report.name} (Copy)`,
      createdAt: new Date(),
      lastRun: undefined,
    };
    setSavedReports(prev => [...prev, duplicate]);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports"
        subtitle="Generate and export project reports"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="font-mono text-xs uppercase"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
            <ExportDialog
              trigger={
                <Button variant="outline" className="font-mono text-xs uppercase">
                  <span className="material-symbols-outlined text-[16px] mr-2">download</span>
                  Export
                </Button>
              }
              title="Export Tasks"
              formats={['csv', 'pdf']}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
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

          {/* Saved Reports Section */}
          {savedReports.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Saved Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedReports.map((report) => (
                  <Card key={report.id} className="relative group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">{report.name}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateReport(report)}>
                              <Copy className="h-4 w-4 mr-2" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>
                        {REPORT_TYPES.find(t => t.value === report.type)?.label}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Created: {report.createdAt.toLocaleDateString()}</p>
                        {report.lastRun && <p>Last run: {report.lastRun.toLocaleDateString()}</p>}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 font-mono text-xs"
                        onClick={() => handleQuickExport('pdf')}
                      >
                        Run Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Export Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Export</h2>
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
          </div>

          {/* Report Preview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Report Preview</h2>
            <ReportPreview tasks={tasks} dateRange={dateRange} />
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Report Name
              </label>
              <Input 
                placeholder="e.g., Monthly Progress Report" 
                value={newReportName}
                onChange={(e) => setNewReportName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Report Type
              </label>
              <Select value={newReportType} onValueChange={setNewReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateReport}
              disabled={!newReportName || !newReportType}
            >
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
