import { cn } from "@/lib/utils";

interface GanttBarProps {
    name: string;
    startDate: string;
    endDate: string;
    progress: number;
    colorClass?: string;
    totalDays: number;
    startOffsetDays: number;
    durationDays: number;
}

export function GanttBar({
    name,
    startDate,
    endDate,
    progress,
    colorClass = "bg-primary",
    totalDays,
    startOffsetDays,
    durationDays
}: GanttBarProps) {
    const leftPercent = (startOffsetDays / totalDays) * 100;
    const widthPercent = (durationDays / totalDays) * 100;

    return (
        <div className="grid grid-cols-[200px_1fr] gap-4 mb-4 items-center">
            <div className="text-sm font-medium truncate shrink-0 pr-4 border-r border-border">
                {name}
                <div className="font-mono text-[10px] text-muted-foreground uppercase opacity-70 tracking-widest mt-0.5">
                    {startDate} - {endDate}
                </div>
            </div>

            <div className="relative h-10 w-full bg-border/20 border-y border-border/50 flex flex-col justify-center">
                <div
                    className={cn("absolute h-6 rounded-none shadow-sm flex items-center overflow-hidden border border-black/10", colorClass)}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                >
                    <div
                        className="h-full bg-black/20"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

