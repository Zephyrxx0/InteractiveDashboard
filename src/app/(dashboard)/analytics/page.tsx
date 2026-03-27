"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
    LineChartWidget,
    BarChartWidget,
    PieChartWidget,
} from "@/components/ui/charts";
import type { DateRange } from "react-day-picker";

// Mock data for KPI cards
const kpiData = [
    {
        title: "Total Tasks",
        value: "248",
        icon: "task_alt",
        trend: { value: "+12%", direction: "up" as const, label: "vs last period" },
    },
    {
        title: "Completed",
        value: "186",
        icon: "check_circle",
        trend: { value: "+8%", direction: "up" as const, label: "vs last period" },
    },
    {
        title: "In Progress",
        value: "42",
        icon: "pending",
        trend: { value: "-5%", direction: "down" as const, label: "vs last period" },
    },
    {
        title: "Overdue",
        value: "20",
        icon: "warning",
        trend: { value: "+3%", direction: "up" as const, label: "vs last period" },
    },
];

// Mock data for line chart - task completion over last 7 days
const lineChartData = [
    { day: "Mon", completed: 12 },
    { day: "Tue", completed: 19 },
    { day: "Wed", completed: 15 },
    { day: "Thu", completed: 22 },
    { day: "Fri", completed: 28 },
    { day: "Sat", completed: 14 },
    { day: "Sun", completed: 18 },
];

// Mock data for bar chart - tasks by assignee
const barChartData = [
    { assignee: "Alice", tasks: 45 },
    { assignee: "Bob", tasks: 38 },
    { assignee: "Carol", tasks: 52 },
    { assignee: "David", tasks: 29 },
    { assignee: "Emma", tasks: 41 },
];

// Mock data for pie chart - task status distribution
const pieChartData = [
    { name: "To Do", value: 35, color: "hsl(var(--muted-foreground))" },
    { name: "In Progress", value: 42, color: "hsl(var(--chart-2, 173 58% 39%))" },
    { name: "Done", value: 186, color: "hsl(var(--primary))" },
    { name: "Blocked", value: 5, color: "hsl(var(--destructive))" },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
    });

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Global Analytics"
                subtitle="High-level insights across all projects"
                actions={
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                }
            />

            <div className="flex-1 p-6 grid-bg overflow-auto">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpiData.map((kpi) => (
                            <KpiCard
                                key={kpi.title}
                                title={kpi.title}
                                value={kpi.value}
                                icon={kpi.icon}
                                trend={kpi.trend}
                            />
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Line Chart - Task Completion Trend */}
                        <LineChartWidget
                            data={lineChartData}
                            dataKey="completed"
                            xAxisKey="day"
                            title="Task Completion Trend"
                            subtitle="Tasks completed over the last 7 days"
                            height={280}
                        />

                        {/* Bar Chart - Tasks by Assignee */}
                        <BarChartWidget
                            data={barChartData}
                            dataKey="tasks"
                            xAxisKey="assignee"
                            title="Tasks by Assignee"
                            subtitle="Total assigned tasks per team member"
                            height={280}
                        />
                    </div>

                    {/* Pie Chart Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart - Task Status Distribution */}
                        <PieChartWidget
                            data={pieChartData}
                            title="Task Status Distribution"
                            subtitle="Current task breakdown by status"
                            height={300}
                            innerRadius={60}
                            outerRadius={100}
                        />

                        {/* Placeholder for future chart or data */}
                        <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <span className="material-symbols-outlined text-4xl mb-2 block">
                                    insights
                                </span>
                                <p className="text-sm">More analytics coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
