'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Default color palette using CSS variable-compatible colors
const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 173 58% 39%))',
  'hsl(var(--chart-3, 197 37% 24%))',
  'hsl(var(--chart-4, 43 74% 66%))',
  'hsl(var(--chart-5, 27 87% 67%))',
];

interface PieChartWidgetProps {
  data: Array<{ name: string; value: number; color?: string }>;
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

/**
 * Pie/Donut chart widget for displaying distribution data.
 * SSR-safe with client-only rendering.
 * Set innerRadius > 0 for donut style.
 */
function PieChartWidget({
  data,
  title,
  subtitle,
  className,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
}: PieChartWidgetProps) {
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
        <Skeleton style={{ height }} className="w-full rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div
      data-slot="pie-chart-widget"
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { PieChartWidget };
export type { PieChartWidgetProps };
