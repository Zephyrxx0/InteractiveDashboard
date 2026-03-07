import { PageHeader } from "@/components/page-header";
import { TaskList } from "@/components/features/task-list";
import { Button } from "@/components/ui/button";

const MOCK_TASKS = [
    {
        id: "T-1001",
        name: "Finalize Phase 2 Environment Report",
        assignee: { name: "Sarah J.", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
        dueDate: "Today",
        dueDateUrgent: true,
        tag: { label: "Documentation", color: "bg-info/20 text-info border border-info/30" },
    },
    {
        id: "T-1002",
        name: "Deploy sensors at Site B",
        assignee: { name: "Mike T.", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
        dueDate: "Tomorrow",
        tag: { label: "Field Work", color: "bg-warning/20 text-warning border border-warning/30" },
    },
    {
        id: "T-1003",
        name: "Review Q3 Budget Allocation",
        assignee: { name: "Elena M.", avatarUrl: "https://i.pravatar.cc/150?u=elena" },
        dueDate: "Oct 15",
        tag: { label: "Finance", color: "bg-success/20 text-success border border-success/30" },
    },
    {
        id: "T-1004",
        name: "Draft Community Outreach Plan",
        dueDate: "Oct 18",
        tag: { label: "Planning", color: "bg-primary/20 text-primary border border-primary/30" },
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

export default function TasksPage() {
    return (
        <>
            <PageHeader
                title="Tasks Hub"
                subtitle="Manage and track tasks horizontally across all projects"
                actions={
                    <Button
                        className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                        New Task
                    </Button>
                }
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold">My Tasks</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground uppercase">Filter by:</span>
                            <select className="bg-card border border-border text-xs px-2 py-1 font-mono uppercase focus:outline-none">
                                <option>Status: All</option>
                                <option>Status: Open</option>
                                <option>Status: Done</option>
                            </select>
                        </div>
                    </div>

                    <TaskList tasks={MOCK_TASKS} />
                </div>
            </div>
        </>
    );
}

