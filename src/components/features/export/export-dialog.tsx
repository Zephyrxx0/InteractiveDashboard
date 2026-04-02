'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ExportFormat, ExportOptions } from '@/types/report';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface ExportDialogProps {
  trigger: React.ReactNode;
  title?: string;
  formats?: ExportFormat[];
  onExport: (options: ExportOptions) => void;
  isExporting?: boolean;
}

export function ExportDialog({
  trigger,
  title = 'Export Data',
  formats = ['csv', 'pdf'],
  onExport,
  isExporting = false,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(formats[0]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleExport = () => {
    onExport({
      format: selectedFormat,
      dateRange: dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Format selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Format</label>
            <div className="flex gap-2">
              {formats.map(format => (
                <Button
                  key={format}
                  variant={selectedFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFormat(format)}
                  className="font-mono text-xs uppercase"
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          {/* Date range filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range (optional)</label>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              presets={[
                { label: 'Last 7 days', days: 7 },
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 90 days', days: 90 },
              ]}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                Exporting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">download</span>
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
