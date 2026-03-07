import { cn } from "@/lib/utils";

interface KpiCardProps {
    title: string;
    value: string;
    icon: string;
    trend?: {
        value: string;
        direction: "up" | "down" | "stable";
        label: string;
    };
    children?: React.ReactNode;
    className?: string;
}

export function KpiCard({ title, value, icon, trend, children, className }: KpiCardProps) {
    const trendColor =
        trend?.direction === "up"
            ? "text-primary bg-primary/10"
            : trend?.direction === "down"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground bg-background";

    const trendIcon =
        trend?.direction === "up"
            ? "trending_up"
            : trend?.direction === "down"
                ? "trending_down"
                : "remove";

    return (
        <div
            className={cn(
                "bg-card border border-border p-5 flex flex-col justify-between group hover:border-primary transition-colors relative",
                className
            )}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wide">{title}</h3>
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">{icon}</span>
            </div>
            <div className="relative">
                <p className="font-display text-4xl font-semibold text-foreground tracking-tight mt-2">
                    {value}
                </p>
                {children}
            </div>
            {trend && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-background">
                    <span className={cn("flex items-center text-xs font-bold font-mono px-1.5 py-0.5", trendColor)}>
                        <span className="material-symbols-outlined text-[12px] mr-1">{trendIcon}</span>
                        {trend.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                </div>
            )}
        </div>
    );
}
