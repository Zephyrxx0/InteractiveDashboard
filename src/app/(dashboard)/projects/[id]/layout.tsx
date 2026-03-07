"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
    { label: "Overview", segment: "" },
    { label: "Timeline", segment: "timeline" },
    { label: "Tasks", segment: "tasks" },
    { label: "Outputs", segment: "outputs" },
    { label: "Reports", segment: "reports" },
    { label: "Media", segment: "media" },
];

export default function ProjectDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.id as string;

    // Determine active tab from URL
    const segments = pathname.split("/");
    const activeSegment = segments.length > 3 ? segments[3] : "";

    return (
        <>
            <PageHeader
                title="Clean Water Initiative - Phase 2"
                subtitle="WTR-2024-882 · SE Asia · Active"
                projectName="Clean Water Initiative"
            />

            {/* Tab bar — URL-driven */}
            <div className="border-b border-border bg-card px-6">
                <Tabs value={activeSegment} className="-mb-px">
                    <TabsList className="bg-transparent h-auto p-0 gap-0">
                        {tabs.map((tab) => {
                            const href = tab.segment
                                ? `/projects/${projectId}/${tab.segment}`
                                : `/projects/${projectId}`;

                            return (
                                <Link key={tab.segment} href={href}>
                                    <TabsTrigger
                                        value={tab.segment}
                                        className="font-mono text-xs uppercase tracking-wider px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground hover:text-foreground"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                </Link>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </>
    );
}
