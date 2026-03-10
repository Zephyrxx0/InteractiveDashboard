import { EmptyState } from "@/components/ui/empty-state";

export default function ProjectMediaPage() {
    return (
        <div className="p-6 grid-bg min-h-full">
            <div className="max-w-[1200px] mx-auto">
                <EmptyState
                    icon="photo_library"
                    title="Media Library"
                    description="Upload and manage field photographs, drone imagery, and other project media artifacts."
                    actionLabel="Upload Media"
                />
            </div>
        </div>
    );
}
