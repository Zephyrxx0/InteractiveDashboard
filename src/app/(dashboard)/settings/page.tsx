"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPicker } from "@/components/ui/icon-picker";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("Building");

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

                    {/* Appearance Section */}
                    <div className="bg-card border border-border p-8">
                        <div className="mb-6 pb-6 border-b border-border/50">
                            <h2 className="font-display text-xl font-bold">Appearance</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Customize the look and feel of your dashboard.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Organization Icon
                                    </label>
                                    <IconPicker 
                                        value={selectedIcon} 
                                        onChange={setSelectedIcon}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Choose an icon to represent your organization in the sidebar.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Preview
                                    </label>
                                    <div className="h-[42px] px-3 flex items-center gap-3 bg-background border border-border rounded-md">
                                        <div className="size-8 bg-foreground text-primary flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[18px]">
                                                {selectedIcon.toLowerCase().replace(/([A-Z])/g, '_$1').slice(1)}
                                            </span>
                                        </div>
                                        <span className="font-display font-bold text-sm">Eco-Grid</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="button"
                                    disabled={loading}
                                    className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                >
                                    Save Appearance
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

