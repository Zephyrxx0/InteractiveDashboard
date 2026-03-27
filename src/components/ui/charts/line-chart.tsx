'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LineChartWidgetProps {
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
 * Line chart widget for displaying trend data over time.
 * SSR-safe with client-only rendering.
 */
function LineChartWidget({
  data,
  dataKey,
  xAxisKey,
  title,
  subtitle,
  className,
  height = 300,
  color = 'hsl(var(--primary))',
}: LineChartWidgetProps) {
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
      data-slot="line-chart-widget"
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
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { LineChartWidget };
export type { LineChartWidgetProps };
