import { cn } from "@/lib/utils";

type StatusType = "active" | "warning" | "halted" | "planning" | "completed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary text-white" },
  warning: { label: "Warning", className: "bg-eco-ochre text-white" },
  halted: { label: "Halted", className: "bg-eco-clay text-white" },
  planning: { label: "Planning", className: "bg-eco-ochre text-white" },
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
