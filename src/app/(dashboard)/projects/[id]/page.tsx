"use client";

import { useState } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { DocumentViewerModal } from "@/components/data/DocumentViewerModal";
import { LocationCard } from "@/components/features/map/location-card";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/use-projects";

export default function ProjectOverviewPage() {
    const params = useParams();
    const projectId = params.id as string;
    const { data: project } = useProject(projectId);
    const [viewingDoc, setViewingDoc] = useState<{ name: string; type: string } | null>(null);
    return (
        <div className="p-6 grid-bg">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Beneficiaries"
                        value="3,210"
                        icon="group"
                        trend={{ value: "+8%", direction: "up", label: "this quarter" }}
                    />
                    <KpiCard
                        title="Budget Spent"
                        value="₹97,500"
                        icon="currency_rupee"
                        trend={{ value: "65%", direction: "stable", label: "of ₹150,000" }}
                    />
                    <KpiCard
                        title="Tasks Complete"
                        value="24/36"
                        icon="task_alt"
                        trend={{ value: "67%", direction: "up", label: "on track" }}
                    />
                    <KpiCard
                        title="Days Remaining"
                        value="42"
                        icon="schedule"
                        trend={{ value: "", direction: "stable", label: "until deadline" }}
                    />
                </div>

                {/* Content sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border p-6 shadow-brutal">
                            <h3 className="font-display text-lg font-bold mb-4">Project Overview</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Implementation of solar-powered filtration systems in rural districts across Southeast Asia.
                                The project focuses on providing clean, safe drinking water through sustainable technology,
                                combined with community training programs for long-term maintenance and operation.
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Phase 2 extends coverage to four additional districts and introduces a monitoring dashboard
                                for real-time water quality tracking via IoT sensors deployed at each filtration site.
                            </p>
                        </div>

                        {/* Reference Documents Library */}
                        <div className="bg-card border border-border p-6 shadow-brutal">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-lg font-bold">Reference Library</h3>
                                <span className="font-mono text-[10px] bg-accent/10 text-accent px-2 py-1 uppercase font-bold">
                                    3 Documents
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                {[
                                    { name: "Project_Proposal_v2.docx", type: "docx", date: "12 Mar 2024" },
                                    { name: "Budget_Allocation_Q1.xlsx", type: "xlsx", date: "15 Mar 2024" },
                                    { name: "Site_Survey_Photos.csv", type: "csv", date: "20 Mar 2024" },
                                ].map((doc) => (
                                    <div key={doc.name} className="group flex items-center justify-between p-3 bg-muted/10 border border-border/50 hover:border-accent/50 hover:bg-muted/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined text-2xl ${
                                                doc.type === 'xlsx' ? 'text-green-500' : 
                                                doc.type === 'docx' ? 'text-blue-500' : 'text-orange-500'
                                            }`}>
                                                {doc.type === 'xlsx' ? 'table_chart' : 
                                                 doc.type === 'docx' ? 'description' : 'analytics'}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium">{doc.name}</p>
                                                <p className="text-[10px] font-mono text-muted-foreground uppercase">{doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setViewingDoc({ name: doc.name, type: doc.type })}
                                                className="p-1.5 hover:bg-background rounded border border-border text-muted-foreground hover:text-accent"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-background rounded border border-border text-muted-foreground hover:text-accent">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-background rounded border border-border text-muted-foreground hover:text-destructive">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Location Section */}
                        <LocationCard 
                            projectId={projectId} 
                            projectName={project?.name || "Loading..."}
                            projectStatus={project?.status || "on_track"}
                        />
                    </div>

                    {/* Project Details Sidebar */}
                    <div className="bg-card border border-border p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold mb-4">Details</h3>
                        {[
                            { label: "Project ID", value: "WTR-2024-882" },
                            { label: "Region", value: "Southeast Asia" },
                            { label: "Status", value: "Active" },
                            { label: "Start Date", value: "01 Jan 2024" },
                            { label: "Deadline", value: "12 Oct 2024" },
                            { label: "Budget", value: "₹150,000" },
                            { label: "Lead", value: "S. Miller" },
                            { label: "Team Size", value: "12 members" },
                        ].map((item) => (
                            <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm font-medium text-foreground">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DocumentViewerModal 
                open={!!viewingDoc} 
                onOpenChange={(open) => !open && setViewingDoc(null)} 
                document={viewingDoc}
            />
        </div>
    );
}
