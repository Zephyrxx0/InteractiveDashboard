import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotificationsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Notifications"
                subtitle="System alerts, workflow events, and mentions"
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1200px] mx-auto">
                    <EmptyState
                        icon="notifications_off"
                        title="All Caught Up"
                        description="There are no new notifications or system alerts at this time."
                    />
                </div>
            </div>
        </div>
    );
}
