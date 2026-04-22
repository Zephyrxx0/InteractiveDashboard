"use client";

import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWidget } from "@/components/widgets/chart-widget";
import { MapWidget } from "@/components/widgets/map-widget";
import { LogItem } from "@/components/widgets/log-item";
import { ProjectStatusChart } from "@/components/widgets/project-status-chart";
import { IncidentWidget } from "@/components/widgets/incident-widget";
import { Button } from "@/components/ui/button";
import { useRBAC } from "@/hooks/use-rbac";

export default function DashboardPage() {
    const { isAdmin } = useRBAC();

    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Real-time project overview and impact metrics"
                actions={
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <Button
                                className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                                Import Data
                            </Button>
                        )}
                        <div className="flex items-center bg-card border border-border p-0.5">
                            <button className="px-3 py-1 bg-foreground text-card font-mono text-xs font-medium uppercase">Grid</button>
                            <button className="px-3 py-1 text-muted-foreground hover:text-foreground font-mono text-xs font-medium uppercase">List</button>
                        </div>
                    </div>
                }
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">
                        {/* KPI: Total Beneficiaries */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
                            <KpiCard
                                title="Total Beneficiaries"
                                value="14,203"
                                icon="group"
                                trend={{ value: "+12%", direction: "up", label: "vs last month" }}
                            />
                        </div>

                        {/* KPI: Active Sites */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
                            <KpiCard
                                title="Active Sites"
                                value="8"
                                icon="location_on"
                                trend={{ value: "0%", direction: "stable", label: "Stable" }}
                            />
                        </div>

                        {/* KPI: Trees Planted */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
                            <KpiCard
                                title="Trees Planted"
                                value="1,250"
                                icon="forest"
                                trend={{ value: "+5%", direction: "up", label: "vs target" }}
                            />
                        </div>

                        {/* KPI: Budget Utilization */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
                            <KpiCard
                                title="Budget Use"
                                value="65%"
                                icon="attach_money"
                                trend={{ value: "-2%", direction: "down", label: "Under spend" }}
                            >
                                <div className="w-full h-1 bg-background mt-3 relative">
                                    <div className="absolute left-0 top-0 h-full bg-warning w-[65%]" />
                                </div>
                            </KpiCard>
                        </div>

                        {/* Water Quality Analysis Chart */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-6 xl:row-span-2">
                            <ChartWidget />
                        </div>

                        {/* Deployment Map */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-6 xl:row-span-2">
                            <MapWidget />
                        </div>

                        {/* Recent Logs */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4 bg-card border border-border p-6 flex flex-col group hover:border-primary transition-colors relative min-h-[300px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-display text-lg font-bold text-foreground">Recent Logs</h3>
                                <a className="text-xs font-mono text-primary hover:underline uppercase" href="#">
                                    View All
                                </a>
                            </div>
                            <div className="space-y-3">
                                <LogItem icon="article" title="Q3 Impact Report uploaded" meta="By Sarah J. • 2h ago" />
                                <LogItem icon="check_circle" title="Milestone Reached: 1k Trees" meta="System • 4h ago" />
                                <LogItem icon="warning" title="Alert: High wind at Site B" meta="Sensor #402 • 6h ago" />
                            </div>
                        </div>

                        {/* Project Status Pie Chart */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4">
                            <ProjectStatusChart />
                        </div>

                        {/* Active Incidents Widget */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4">
                            <IncidentWidget />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
