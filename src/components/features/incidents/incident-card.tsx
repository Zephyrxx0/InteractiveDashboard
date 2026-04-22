import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Incident } from "@/lib/db/incidents";

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: "arrow_downward" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: "drag_handle" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: "arrow_upward" },
  critical: { label: "Critical", color: "bg-red-500 text-white border-red-600 animate-pulse", icon: "warning" },
};

const STATUS_CONFIG = {
  reported: { label: "Reported", color: "bg-muted text-muted-foreground", icon: "new_releases" },
  acknowledged: { label: "Acknowledged", color: "bg-blue-500/10 text-blue-400", icon: "visibility" },
  investigating: { label: "Investigating", color: "bg-purple-500/10 text-purple-400", icon: "search" },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-400", icon: "check_circle" },
  closed: { label: "Closed", color: "bg-zinc-500/10 text-zinc-500", icon: "archived" },
};

interface IncidentCardProps {
  incident: Incident;
  className?: string;
}

export function IncidentCard({ incident, className }: IncidentCardProps) {
  const priority = PRIORITY_CONFIG[incident.priority as keyof typeof PRIORITY_CONFIG];
  const status = STATUS_CONFIG[incident.status as keyof typeof STATUS_CONFIG];

  return (
    <Card className={cn(
      "rounded-none border-2 border-border p-4 bg-card group hover:border-foreground transition-all shadow-none hover:shadow-brutal",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "material-symbols-outlined text-[18px]",
              incident.priority === 'critical' ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {priority.icon}
            </span>
            <h3 className="font-display text-lg font-bold group-hover:underline">
              {incident.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {incident.description || "No tactical details provided."}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <Badge className={cn(
            "rounded-none border-2 font-mono text-[10px] uppercase px-2 py-0",
            priority.color
          )}>
            {incident.priority}
          </Badge>
          <Badge variant="outline" className={cn(
            "rounded-none border font-mono text-[9px] uppercase px-1 py-0",
            status.color
          )}>
            {incident.status}
          </Badge>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-muted-foreground">assignment</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {/* @ts-ignore */}
              {incident.projects?.name || "Global"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-muted-foreground">schedule</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {new Date(incident.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        
        <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
          arrow_forward
        </span>
      </div>
    </Card>
  );
}
