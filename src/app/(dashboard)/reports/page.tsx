import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function ReportsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Reports Library"
                subtitle="Generate and download system-wide impact reports"
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1200px] mx-auto">
                    <EmptyState
                        icon="description"
                        title="No Reports Generated"
                        description="You haven't generated any impact or operations reports yet. Connect to a data source to begin."
                        actionLabel="Create Report"
                    />
                </div>
            </div>
        </div>
    );
}

