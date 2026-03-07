import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function UsersPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Team Management"
                subtitle="Manage user roles, API access, and field teams"
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[1200px] mx-auto">
                    <EmptyState
                        icon="groups"
                        title="Directory Empty"
                        description="Invite team members to assign roles and manage organizational access."
                        actionLabel="Invite User"
                    />
                </div>
            </div>
        </div>
    );
}

