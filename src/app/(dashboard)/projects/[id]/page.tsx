import { KpiCard } from "@/components/ui/kpi-card";

export default function ProjectOverviewPage() {
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
                        value="$97,500"
                        icon="attach_money"
                        trend={{ value: "65%", direction: "stable", label: "of $150,000" }}
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
                    <div className="lg:col-span-2 bg-card border border-border p-6">
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

                    {/* Project Details Sidebar */}
                    <div className="bg-card border border-border p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold mb-4">Details</h3>
                        {[
                            { label: "Project ID", value: "WTR-2024-882" },
                            { label: "Region", value: "Southeast Asia" },
                            { label: "Status", value: "Active" },
                            { label: "Start Date", value: "01 Jan 2024" },
                            { label: "Deadline", value: "12 Oct 2024" },
                            { label: "Budget", value: "$150,000" },
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
        </div>
    );
}
