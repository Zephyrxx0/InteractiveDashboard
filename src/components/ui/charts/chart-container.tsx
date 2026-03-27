'use client';

import * as React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
}

/**
 * SSR-safe chart container wrapper that handles:
 * - Client-side only rendering (no SSR)
 * - Responsive sizing via Recharts ResponsiveContainer
 * - Loading skeleton while chart initializes
 */
function ChartContainer({
  children,
  className,
  height = 300,
}: ChartContainerProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Skeleton
        className={cn('w-full', className)}
        style={{ height }}
        data-slot="chart-skeleton"
      />
    );
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export { ChartContainer };
export type { ChartContainerProps };
