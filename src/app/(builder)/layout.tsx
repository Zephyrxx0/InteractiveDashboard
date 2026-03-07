"use client";

import { useRequireAuth } from "@/lib/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useRequireAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-8 bg-foreground text-primary flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null; // Will redirect via useRequireAuth

    // Builder layout is fullscreen without the standard sidebar
    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-background flex flex-col text-foreground">
                {children}
            </div>
        </TooltipProvider>
    );
}

