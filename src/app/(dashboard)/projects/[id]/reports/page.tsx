import { EmptyState } from "@/components/ui/empty-state";

export default function ProjectReportsPage() {
    return (
        <div className="p-6 grid-bg min-h-full">
            <div className="max-w-[1200px] mx-auto">
                <EmptyState
                    icon="description"
                    title="No Reports Found for this Project"
                    description="Upload evaluation files, donor reports, or automatically generate an impact summary based on current data."
                    actionLabel="Generate Report"
                />
            </div>
        </div>
    );
}

