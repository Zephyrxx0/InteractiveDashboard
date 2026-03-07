import { cn } from "@/lib/utils";

export type StatusType = "active" | "warning" | "halted" | "planning" | "completed";

export interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-primary text-primary-foreground" },
    warning: { label: "Warning", className: "bg-warning text-warning-foreground" },
    halted: { label: "Halted", className: "bg-destructive text-destructive-foreground" },
    planning: { label: "Planning", className: "bg-warning text-warning-foreground" },
    completed: { label: "Completed", className: "bg-border text-foreground" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <span
            className={cn(
                "px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
