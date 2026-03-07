"use client";

import { AppShell } from "@/components/app-shell";
import { useRequireAuth } from "@/lib/auth";

export default function DashboardLayout({
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
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) return null; // Will redirect via useRequireAuth

    return <AppShell>{children}</AppShell>;
}
