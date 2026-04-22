"use client";

import { useIncident, useUpdateIncident } from "@/hooks/use-incidents";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: "arrow_downward" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: "drag_handle" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: "arrow_upward" },
  critical: { label: "Critical", color: "bg-red-500 text-white border-red-600 animate-pulse", icon: "warning" },
};

const STATUS_OPTIONS = ["reported", "acknowledged", "investigating", "resolved", "closed"] as const;

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: incident, isLoading } = useIncident(id);
  const updateMutation = useUpdateIncident();

  if (isLoading) return <div className="p-8 font-mono text-xs animate-pulse">Retrieving incident telemetry...</div>;
  if (!incident) return <div className="p-8 font-mono text-xs">Error: Incident record not found.</div>;

  const priority = PRIORITY_CONFIG[incident.priority as keyof typeof PRIORITY_CONFIG];

  const handleStatusChange = (newStatus: typeof STATUS_OPTIONS[number]) => {
    updateMutation.mutate({ 
      id: incident.id, 
      updates: { 
        status: newStatus,
        resolved_at: newStatus === 'resolved' ? new Date().toISOString() : incident.resolved_at
      } 
    });
  };

  return (
    <>
      <PageHeader
        title={incident.title}
        subtitle={`Incident ID: ${incident.id.slice(0, 8).toUpperCase()}`}
        actions={
          <Button variant="outline" onClick={() => router.back()} className="font-mono text-xs uppercase rounded-none border-2">
            Back to Hub
          </Button>
        }
      />

      <div className="flex-1 p-6 grid-bg">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-none border-2 border-border p-6 shadow-brutal bg-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={cn("material-symbols-outlined text-3xl", incident.priority === 'critical' ? 'text-red-500' : '')}>
                    {priority.icon}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold">Tactical Description</h2>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Logged: {new Date(incident.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <Badge className={cn("rounded-none border-2 font-mono uppercase", priority.color)}>
                  {incident.priority}
                </Badge>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {incident.description || "No tactical details provided in the initial report."}
                </p>
              </div>

              <Separator className="my-6 border-border" />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/20 border border-border">
                  <span className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Status</span>
                  <p className="font-display font-bold uppercase">{incident.status}</p>
                </div>
                <div className="p-3 bg-muted/20 border border-border">
                  <span className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Resolution Time</span>
                  <p className="font-display font-bold uppercase">
                    {incident.resolved_at ? "Resolved" : "Active"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Resolution/Actions */}
            <Card className="rounded-none border-2 border-border p-6 bg-card">
              <h2 className="font-display text-lg font-bold mb-4">Command Actions</h2>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <Button
                    key={status}
                    variant={incident.status === status ? "default" : "outline"}
                    className="font-mono text-[10px] uppercase rounded-none px-4 h-8"
                    onClick={() => handleStatusChange(status)}
                    disabled={updateMutation.isPending}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              {incident.status === 'resolved' && (
                <div className="mt-6 p-4 border-2 border-green-500/20 bg-green-500/5 rounded-none">
                  <h3 className="text-xs font-bold text-green-500 uppercase mb-2">Root Cause Analysis (RCA)</h3>
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono placeholder:text-muted-foreground/50 h-24 resize-none"
                    placeholder="Document the technical root cause here..."
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-green-500">Save RCA</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-none border-2 border-border p-6 bg-secondary/30">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest mb-4">Sector Intelligence</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Project Sector</span>
                  <Link 
                    href={`/projects/${incident.project_id}`}
                    className="block text-sm font-bold hover:underline decoration-2"
                  >
                    {/* @ts-ignore */}
                    {incident.projects?.name || "Global Command"}
                  </Link>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Reporter ID</span>
                  <p className="text-sm font-mono truncate">{incident.reporter_id || "ANON-SOURCE-01"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Assignee</span>
                  <p className="text-sm font-bold">{incident.assignee_id || "Unassigned"}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-none border-2 border-border p-6 bg-card border-dashed">
              <h3 className="font-display text-sm font-bold uppercase mb-4">Tactical Log</h3>
              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">12:00</span>
                  <span>Incident reported by telemetry system.</span>
                </div>
                <div className="flex gap-2 text-blue-400">
                  <span className="text-muted-foreground shrink-0">12:05</span>
                  <span>System acknowledged by manual override.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
