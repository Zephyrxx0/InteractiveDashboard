"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIncidents } from "@/hooks/use-incidents";
import { useProjects } from "@/hooks/use-projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export default function IncidentsPage() {
  const { data: incidents = [], isLoading } = useIncidents();
  const { data: projects = [] } = useProjects();
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (filterPriority !== "all" && incident.priority !== filterPriority) return false;
      if (filterProject !== "all" && incident.project_id !== filterProject) return false;
      return true;
    });
  }, [incidents, filterPriority, filterProject]);

  if (isLoading) {
    return <div className="p-8 font-mono text-xs uppercase animate-pulse">Scanning frequencies...</div>;
  }

  return (
    <>
      <PageHeader
        title="Incident Control Room"
        subtitle="Manage critical project blockers and field emergencies"
        actions={
          <Button className="font-mono text-xs uppercase tracking-wider font-bold shadow-brutal hover:shadow-brutal-hover active:shadow-none transition-all">
            <span className="material-symbols-outlined text-[16px] mr-2">report</span>
            File Incident
          </Button>
        }
      />

      <div className="flex-1 p-6 grid-bg">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Priority:</span>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="h-8 w-32 rounded-none border-2 border-border font-mono text-[10px] uppercase">
                  <SelectValue placeholder="Filter Priority" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-border">
                  <SelectItem value="all" className="text-[10px] uppercase">All Levels</SelectItem>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-[10px] uppercase">
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site:</span>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="h-8 w-48 rounded-none border-2 border-border font-mono text-[10px] uppercase">
                  <SelectValue placeholder="Filter Project" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-border">
                  <SelectItem value="all" className="text-[10px] uppercase">All Projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-[10px] uppercase">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIncidents.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-border text-center">
                <p className="font-mono text-xs text-muted-foreground uppercase">No incidents detected in current sector.</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <Link key={incident.id} href={`/incidents/${incident.id}`}>
                  <Card className="rounded-none border-2 border-border p-4 bg-card group hover:border-foreground transition-all shadow-none hover:shadow-brutal">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "material-symbols-outlined text-[18px]",
                            incident.priority === 'critical' ? 'text-red-500' : 'text-muted-foreground'
                          )}>
                            {PRIORITY_CONFIG[incident.priority as keyof typeof PRIORITY_CONFIG].icon}
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
                          PRIORITY_CONFIG[incident.priority as keyof typeof PRIORITY_CONFIG].color
                        )}>
                          {incident.priority}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "rounded-none border font-mono text-[9px] uppercase px-1 py-0",
                          STATUS_CONFIG[incident.status as keyof typeof STATUS_CONFIG].color
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
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
