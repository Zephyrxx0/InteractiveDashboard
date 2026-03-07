"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BuilderPage() {
    return (
        <div className="flex flex-col h-full bg-background min-h-screen">
            {/* Top Toolbar */}
            <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="w-px h-6 bg-border mx-2" />
                    <div>
                        <h1 className="font-display font-bold text-lg">New Custom Dashboard</h1>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Unsaved Draft
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="font-mono text-xs uppercase tracking-wider font-bold h-9">
                        Preview
                    </Button>
                    <Button className="font-mono text-xs uppercase tracking-wider font-bold h-9 shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        Save & Publish
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Widget Palette */}
                <div className="w-64 border-r border-border bg-card flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Components
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div className="p-3 border-2 border-dashed border-border bg-background cursor-grab hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground">bar_chart</span>
                            <span className="font-mono text-[10px] uppercase text-muted-foreground">Bar Chart</span>
                        </div>
                        <div className="p-3 border-2 border-dashed border-border bg-background cursor-grab hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground">pie_chart</span>
                            <span className="font-mono text-[10px] uppercase text-muted-foreground">Donut Chart</span>
                        </div>
                        <div className="p-3 border-2 border-dashed border-border bg-background cursor-grab hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground">map</span>
                            <span className="font-mono text-[10px] uppercase text-muted-foreground">Map Widget</span>
                        </div>
                        <div className="p-3 border-2 border-dashed border-border bg-background cursor-grab hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground">format_list_bulleted</span>
                            <span className="font-mono text-[10px] uppercase text-muted-foreground">Data Table</span>
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-background grid-bg p-8 overflow-y-auto">
                    <div className="w-full min-h-full border-2 border-dashed border-border/50 bg-card/30 flex items-center justify-center relative">
                        <div className="text-center absolute">
                            <div className="size-16 mx-auto mb-4 border border-border bg-card flex items-center justify-center text-muted-foreground shadow-sm">
                                <span className="material-symbols-outlined text-[32px]">drag_indicator</span>
                            </div>
                            <h2 className="font-display text-xl text-muted-foreground font-medium mb-1">
                                Drop widgets here
                            </h2>
                            <p className="font-mono text-xs text-muted-foreground uppercase opacity-70">
                                Build your dashboard layout
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Properties */}
                <div className="w-72 border-l border-border bg-card flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Properties
                        </h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-border text-4xl mb-3">settings</span>
                        <p className="font-mono text-[10px] uppercase text-muted-foreground">
                            Select a widget to edit its properties
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
