import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    status: "active" | "warning" | "halted" | "planning";
    imageUrl: string;
    budget: string;
    lead: { name: string; avatarUrl: string };
    deadline: string;
    region: string;
    progress: number;
    href?: string;
    className?: string;
}

const progressColor: Record<string, string> = {
    active: "bg-primary",
    warning: "bg-warning",
    halted: "bg-destructive",
    planning: "bg-warning",
};

export function ProjectCard({
    id,
    title,
    description,
    status,
    imageUrl,
    budget,
    lead,
    deadline,
    region,
    progress,
    href,
    className,
}: ProjectCardProps) {
    const cardClassName = cn(
        "group bg-card border border-border hover:border-primary transition-colors duration-300 flex flex-col relative cursor-pointer",
        className
    );

    const content = (
        <>
            {/* Status Badge */}
            <div className="absolute top-0 right-0 z-20">
                <StatusBadge status={status} />
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video overflow-hidden border-b border-border">
                <img
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                    src={imageUrl}
                    alt={title}
                />
                <div className="absolute bottom-0 left-0 bg-background/90 px-2 py-1 border-t border-r border-border">
                    <span className="text-[10px] font-mono uppercase text-foreground tracking-widest">
                        ID: {id}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-4">
                <div>
                    <h3 className="text-lg font-display font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-4 border-y border-border/50">
                    <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                        <p className="text-sm font-mono font-medium text-foreground">{budget}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Lead</p>
                        <div className="flex items-center gap-2">
                            <div className="size-5 bg-border overflow-hidden">
                                <img alt={lead.name} className="w-full h-full object-cover" src={lead.avatarUrl} />
                            </div>
                            <span className="text-sm font-mono font-medium text-foreground">{lead.name}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Deadline</p>
                        <p className={cn(
                            "text-sm font-mono font-medium",
                            deadline === "Overdue" ? "text-destructive" : "text-foreground"
                        )}>{deadline}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Region</p>
                        <p className="text-sm font-mono font-medium text-foreground">{region}</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-background border-t border-border">
                <div className={cn("h-full", progressColor[status])} style={{ width: `${progress}%` }} />
            </div>
        </>
    );

    if (href) {
        return (
            <Link href={href} className={cardClassName}>
                {content}
            </Link>
        );
    }

    return <div className={cardClassName}>{content}</div>;
}
