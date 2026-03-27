'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface BarChartWidgetProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  color?: string;
}

/**
 * Bar chart widget for displaying categorical comparison data.
 * SSR-safe with client-only rendering.
 */
function BarChartWidget({
  data,
  dataKey,
  xAxisKey,
  title,
  subtitle,
  className,
  height = 300,
  color = 'hsl(var(--primary))',
}: BarChartWidgetProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className={cn(
          'bg-card border border-border rounded-xl p-6',
          className
        )}
      >
        {title && (
          <div className="mb-4">
            <Skeleton className="h-5 w-32 mb-1" />
            {subtitle && <Skeleton className="h-4 w-48" />}
          </div>
        )}
        <Skeleton style={{ height }} className="w-full" />
      </div>
    );
  }

  return (
    <div
      data-slot="bar-chart-widget"
      className={cn(
        'bg-card border border-border rounded-xl p-6',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-semibold text-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey={xAxisKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { BarChartWidget };
export type { BarChartWidgetProps };
