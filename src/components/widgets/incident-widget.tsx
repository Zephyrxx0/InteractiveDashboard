"use client";

import { useIncidents } from "@/hooks/use-incidents";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PRIORITY_ICONS = {
  low: "arrow_downward",
  medium: "drag_handle",
  high: "arrow_upward",
  critical: "warning",
};

export function IncidentWidget() {
  const { data: incidents = [], isLoading } = useIncidents();

  const activeIncidents = incidents
    .filter(i => i.status !== 'closed' && i.status !== 'resolved')
    .slice(0, 3);

  return (
    <div className="bg-card border border-border p-6 flex flex-col group hover:border-red-500/50 transition-colors relative min-h-[300px] shadow-[var(--shadow-brutal)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500 animate-pulse">emergency</span>
          <h3 className="font-display text-lg font-bold text-foreground">Active Incidents</h3>
        </div>
        <Link 
          href="/incidents" 
          className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-widest border-b border-muted-foreground/30"
        >
          Dispatch Center
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : activeIncidents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50 grayscale">
            <span className="material-symbols-outlined text-4xl mb-2 text-muted-foreground">verified_user</span>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">All sectors clear</p>
          </div>
        ) : (
          activeIncidents.map((incident) => (
            <Link 
              key={incident.id} 
              href={`/incidents/${incident.id}`}
              className="block group/item"
            >
              <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/50 group-hover/item:border-red-500/30 group-hover/item:bg-red-500/5 transition-all">
                <span className={cn(
                  "material-symbols-outlined text-[18px] shrink-0",
                  incident.priority === 'critical' ? 'text-red-500' : 'text-muted-foreground'
                )}>
                  {PRIORITY_ICONS[incident.priority as keyof typeof PRIORITY_ICONS]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight truncate group-hover/item:underline">
                    {incident.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">
                      {/* @ts-ignore */}
                      {incident.projects?.name?.split(' ')[0] || "Global"}
                    </span>
                    <Badge variant="outline" className={cn(
                      "text-[8px] px-1 py-0 h-3 rounded-none uppercase",
                      incident.priority === 'critical' ? 'border-red-500 text-red-500' : ''
                    )}>
                      {incident.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase">
          <span>SLA Tracking Active</span>
          <span className="text-red-500 font-bold">
            {incidents.filter(i => i.priority === 'critical').length} Critical
          </span>
        </div>
      </div>
    </div>
  );
}
