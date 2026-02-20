import { Header } from "@/components/header";
import { Toolbar } from "@/components/toolbar";
import { MetricCard } from "@/components/metric-card";
import { ChartWidget } from "@/components/chart-widget";
import { MapWidget } from "@/components/map-widget";
import { LogItem } from "@/components/log-item";
import { ProjectStatusChart } from "@/components/project-status-chart";

export default function DashboardPage() {
  return (
    <>
      <Header activeNav="dashboard" />
      <Toolbar />

      <main className="flex-1 p-6 overflow-y-auto grid-bg">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">
            {/* KPI: Total Beneficiaries */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
              <MetricCard
                title="Total Beneficiaries"
                value="14,203"
                icon="group"
                trend={{ value: "+12%", direction: "up", label: "vs last month" }}
              />
            </div>

            {/* KPI: Active Sites */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
              <MetricCard
                title="Active Sites"
                value="8"
                icon="location_on"
                trend={{ value: "0%", direction: "stable", label: "Stable" }}
              />
            </div>

            {/* KPI: Trees Planted */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
              <MetricCard
                title="Trees Planted"
                value="1,250"
                icon="forest"
                trend={{ value: "+5%", direction: "up", label: "vs target" }}
              />
            </div>

            {/* KPI: Budget Utilization */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
              <MetricCard
                title="Budget Use"
                value="65%"
                icon="attach_money"
                trend={{ value: "-2%", direction: "down", label: "Under spend" }}
              >
                {/* Budget progress bar */}
                <div className="w-full h-1 bg-background mt-3 relative">
                  <div className="absolute left-0 top-0 h-full bg-eco-ochre w-[65%]" />
                </div>
              </MetricCard>
            </div>

            {/* Water Quality Analysis Chart (2x2) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-6 xl:row-span-2">
              <ChartWidget />
            </div>

            {/* Deployment Map (2x2) */}
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
                <LogItem
                  icon="article"
                  title="Q3 Impact Report uploaded"
                  meta="By Sarah J. • 2h ago"
                />
                <LogItem
                  icon="check_circle"
                  title="Milestone Reached: 1k Trees"
                  meta="System • 4h ago"
                />
                <LogItem
                  icon="warning"
                  title="Alert: High wind at Site B"
                  meta="Sensor #402 • 6h ago"
                />
              </div>
            </div>

            {/* Project Status Pie Chart */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4">
              <ProjectStatusChart />
            </div>

            {/* Add Widget Placeholder */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4 border-2 border-dashed border-border bg-card/50 flex flex-col items-center justify-center min-h-[300px] group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <div className="size-12 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors mb-3">
                <span className="material-symbols-outlined text-2xl">add</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                Add Widget
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag data or click to configure
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
