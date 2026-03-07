import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Global Analytics"
                subtitle="High-level insights across all projects and resources"
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1200px] mx-auto">
                    <EmptyState
                        icon="bar_chart"
                        title="Analytics Module Offline"
                        description="Your data warehouse connection is currently pending. Connect a supported data source to generate impact reporting."
                        actionLabel="Connect Database"
                    />
                </div>
            </div>
        </div>
    );
}

