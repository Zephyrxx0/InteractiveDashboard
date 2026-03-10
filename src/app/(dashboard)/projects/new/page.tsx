"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save and redirect
        router.push("/projects/P-9999");
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <PageHeader
                title="New Project"
                subtitle="Initialize a new project and set baseline metrics"
                actions={
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                        Cancel
                    </Button>
                }
            />

            <div className="flex-1 p-6 grid-bg overflow-y-auto">
                <div className="max-w-[800px] mx-auto">
                    <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-8">
                        <div>
                            <h2 className="font-display text-xl font-bold mb-4 border-b border-border/50 pb-2">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Project Name
                                    </label>
                                    <Input placeholder="e.g. Coastal Mangrove Restoration" className="font-mono text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Project ID (Auto-generated)
                                    </label>
                                    <Input value="P-9999" disabled className="font-mono text-sm bg-muted/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Status
                                    </label>
                                    <Select defaultValue="planning">
                                        <SelectTrigger className="font-mono text-sm">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="planning">PLANNING</SelectItem>
                                            <SelectItem value="active">ACTIVE</SelectItem>
                                            <SelectItem value="on-hold">ON HOLD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Description
                                    </label>
                                    <Textarea
                                        placeholder="Brief overview of the project's goals and scope..."
                                        className="font-mono text-sm min-h-[100px] resize-y"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-xl font-bold mb-4 border-b border-border/50 pb-2">
                                Location & Timelines
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Primary Location
                                    </label>
                                    <Input placeholder="Region, City, or Coordinates" className="font-mono text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Start Date
                                    </label>
                                    <Input type="date" className="font-mono text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block">
                                        Expected End Date
                                    </label>
                                    <Input type="date" className="font-mono text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-border">
                            <Button
                                type="submit"
                                className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px] mr-2">save</span>
                                Create Project
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

