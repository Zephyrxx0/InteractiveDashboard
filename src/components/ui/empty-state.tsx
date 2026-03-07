"use client";

import { ReactNode } from "react";
import { Button } from "./button";

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    children?: ReactNode;
}

export function EmptyState({ icon = "widgets", title, description, actionLabel, onAction, children }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-border bg-card p-12 text-center">
            <div className="size-16 mb-6 flex items-center justify-center bg-muted/50 border border-border">
                <span className="material-symbols-outlined text-[32px] text-muted-foreground">
                    {icon}
                </span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                    {actionLabel}
                </Button>
            )}
            {children}
        </div>
    );
}

