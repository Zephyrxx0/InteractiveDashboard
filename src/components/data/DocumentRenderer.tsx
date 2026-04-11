"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentRendererProps {
    html: string;
    className?: string;
}

export function DocumentRenderer({ html, className }: DocumentRendererProps) {
    if (!html) return <div className="text-muted-foreground font-mono text-center py-20">Empty Document Content</div>;

    return (
        <div className={cn("bg-card border border-border shadow-brutal p-8", className)}>
            <ScrollArea className="h-[600px] w-full pr-4">
                <div 
                    className="prose prose-slate dark:prose-invert max-w-none 
                    /* ── Design Language Matching ── */
                    [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:tracking-tight [&_h1]:mb-6 [&_h1]:mt-0
                    [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight [&_h2]:mb-4 [&_h2]:mt-8
                    [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-3
                    [&_p]:font-sans [&_p]:text-foreground/90 [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-2
                    [&_li]:text-foreground/90
                    [&_table]:font-mono [&_table]:text-xs [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6
                    [&_table_th]:bg-muted/50 [&_table_th]:border [&_table_th]:border-border [&_table_th]:p-2 [&_table_th]:text-left
                    [&_table_td]:border [&_table_td]:border-border [&_table_td]:p-2
                    [&_strong]:text-foreground [&_strong]:font-semibold
                    [&_a]:text-accent [&_a]:underline
                    [&_img]:rounded-none [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_img]:max-w-full [&_img]:h-auto
                    "
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </ScrollArea>
        </div>
    );
}
