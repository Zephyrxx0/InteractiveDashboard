import { cn } from "@/lib/utils";

interface LogItemProps {
  icon: string;
  title: string;
  meta: string;
  className?: string;
}

export function LogItem({ icon, title, meta, className }: LogItemProps) {
  return (
    <div className={cn("flex gap-3 items-start pb-3 border-b border-background last:border-0", className)}>
      <div className="size-8 bg-background flex items-center justify-center shrink-0 border border-border text-muted-foreground">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{meta}</p>
      </div>
    </div>
  );
}
