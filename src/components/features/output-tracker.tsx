import { cn } from "@/lib/utils";

interface OutputTrackerProps {
    title: string;
    unit: string;
    current: number;
    target: number;
    colorClass?: string;
}

export function OutputTracker({ title, unit, current, target, colorClass = "bg-primary" }: OutputTrackerProps) {
    const progress = Math.min((current / target) * 100, 100);

    return (
        <div className="border border-border bg-card p-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="font-display font-bold text-lg">{title}</h4>
                    <p className="font-mono text-xs text-muted-foreground uppercase mt-1">
                        {current.toLocaleString()} / {target.toLocaleString()} {unit}
                    </p>
                </div>
                <div className="font-mono text-2xl font-bold">
                    {progress.toFixed(0)}%
                </div>
            </div>

            <div className="h-4 bg-muted border border-border w-full relative">
                <div
                    className={cn("h-full border-r border-border transition-all duration-500", colorClass)}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

