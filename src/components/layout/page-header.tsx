"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import React from "react";

/* Map route segments to human-readable labels */
const segmentLabels: Record<string, string> = {
    dashboard: "Dashboard",
    builder: "Dashboard Builder",
    projects: "Projects",
    new: "New Project",
    tasks: "Tasks",
    timeline: "Timeline",
    outputs: "Outputs & Outcomes",
    reports: "Reports",
    media: "Media",
    analytics: "Analytics",
    users: "Users",
    notifications: "Notifications",
    settings: "Settings",
};

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
    /** Override auto-generated breadcrumbs */
    breadcrumbs?: { label: string; href?: string }[];
    /** If provided, used for the dynamic project name in breadcrumbs */
    projectName?: string;
}

export function PageHeader({
    title,
    subtitle,
    actions,
    className,
    breadcrumbs: customBreadcrumbs,
    projectName,
}: PageHeaderProps) {
    const pathname = usePathname();

    /* Auto-generate breadcrumbs from pathname */
    const autoBreadcrumbs = React.useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        const crumbs: { label: string; href: string }[] = [];
        let path = "";

        for (const segment of segments) {
            path += `/${segment}`;
            const label =
                segmentLabels[segment] ??
                (projectName && !segmentLabels[segment] ? projectName : decodeURIComponent(segment));
            crumbs.push({ label, href: path });
        }

        return crumbs;
    }, [pathname, projectName]);

    const breadcrumbs = customBreadcrumbs ?? autoBreadcrumbs;

    return (
        <div className={cn("px-6 py-5 border-b border-border bg-card", className)}>
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <Breadcrumb className="mb-3">
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={crumb.href ?? i}>
                                {i > 0 && <BreadcrumbSeparator />}
                                <BreadcrumbItem>
                                    {i === breadcrumbs.length - 1 ? (
                                        <BreadcrumbPage className="font-mono text-xs uppercase tracking-wider">
                                            {crumb.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={crumb.href ?? "#"}
                                                className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                                            >
                                                {crumb.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            {/* Title row */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
