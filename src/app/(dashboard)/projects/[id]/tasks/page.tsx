"use client";

import { TaskList } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";

const MOCK_PROJECT_TASKS = [
    {
        id: "T-1002",
        name: "Deploy sensors at Site B",
        assignee: { name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
        dueDate: "Tomorrow",
        tag: { label: "Field Work", color: "bg-warning/20 text-warning border border-warning/30" },
    },
    {
        id: "T-1005",
        name: "Equipment Maintenance Log",
        assignee: { name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
        dueDate: "Oct 01",
        completed: true,
        tag: { label: "Maintenance", color: "bg-muted/50 text-muted-foreground border border-border" },
    },
];

export default function ProjectTasksPage() {
    return (
        <div className="p-6 grid-bg min-h-full">
            <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-xl font-bold">Project Tasks</h2>
                        <p className="text-sm text-muted-foreground">Manage tasks specific to this initiative.</p>
                    </div>
                    <Button className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                        Add Task
                    </Button>
                </div>

                <TaskList tasks={MOCK_PROJECT_TASKS} />
            </div>
        </div>
    );
}

