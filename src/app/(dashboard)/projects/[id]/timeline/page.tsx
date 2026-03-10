"use client";

import { PageHeader } from "@/components/page-header";
import { GanttBar } from "@/components/features/gantt-bar";

const TIMELINE_DATA = [
    { id: 1, name: "Phase 1: Research", start: "Jan 1", end: "Feb 15", progress: 100, color: "bg-muted-foreground", startOffset: 0, duration: 45 },
    { id: 2, name: "Phase 2: Permitting", start: "Feb 15", end: "Apr 1", progress: 100, color: "bg-success", startOffset: 45, duration: 45 },
    { id: 3, name: "Phase 3: Sensor Deployment", start: "Apr 1", end: "Jun 1", progress: 60, color: "bg-primary", startOffset: 90, duration: 60 },
    { id: 4, name: "Phase 4: Data Gathering", start: "May 15", end: "Nov 1", progress: 10, color: "bg-warning", startOffset: 135, duration: 170 },
    { id: 5, name: "Phase 5: Analysis & Report", start: "Nov 1", end: "Dec 31", progress: 0, color: "bg-border", startOffset: 305, duration: 60 },
];

export default function ProjectTimelinePage() {
    return (
        <div className="p-6 grid-bg min-h-full">
            <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="bg-card border border-border p-6 overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="flex justify-between items-end border-b border-border pb-4 mb-6">
                            <h3 className="font-display text-xl font-bold">Execution Timeline</h3>

                            {/* Grid markers (Months) */}
                            <div className="flex-1 ml-[200px] pl-4 flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Nov</span>
                            </div>
                        </div>

                        {TIMELINE_DATA.map((item) => (
                            <GanttBar
                                key={item.id}
                                name={item.name}
                                startDate={item.start}
                                endDate={item.end}
                                progress={item.progress}
                                colorClass={item.color}
                                totalDays={365}
                                startOffsetDays={item.startOffset}
                                durationDays={item.duration}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

