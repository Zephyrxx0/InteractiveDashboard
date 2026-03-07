"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Settings"
                subtitle="Manage your organization profile, billing, and system preferences"
            />

            <div className="flex-1 p-6 grid-bg">
                <div className="max-w-[800px] mx-auto space-y-6">
                    <div className="bg-card border border-border p-8">
                        <div className="mb-6 pb-6 border-b border-border/50">
                            <h2 className="font-display text-xl font-bold">Organization Profile</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Core details for your organization unit.
                            </p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Organization Name
                                    </label>
                                    <Input defaultValue="Eco-Grid Foundation" className="font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Support Email
                                    </label>
                                    <Input defaultValue={user?.email || "admin@ecogrid.org"} className="font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Country / Region
                                    </label>
                                    <Input defaultValue="Global" className="font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Timezone
                                    </label>
                                    <Input defaultValue="UTC (Coordinated Universal Time)" className="font-mono text-sm" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

