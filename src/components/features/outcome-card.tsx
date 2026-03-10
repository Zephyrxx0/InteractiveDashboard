interface OutcomeCardProps {
    title: string;
    metric: string;
    baseline: string;
    current: string;
    target: string;
    status: "on-track" | "at-risk" | "off-track";
}

export function OutcomeCard({ title, metric, baseline, current, target, status }: OutcomeCardProps) {
    const statusColors = {
        "on-track": "bg-success text-success-foreground",
        "at-risk": "bg-warning text-warning-foreground",
        "off-track": "bg-destructive text-destructive-foreground",
    };

    const statusLabels = {
        "on-track": "ON TRACK",
        "at-risk": "AT RISK",
        "off-track": "OFF TRACK",
    };

    return (
        <div className="border border-border bg-card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="font-display font-bold text-lg mb-1">{title}</h4>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest px-2 py-0.5 border border-border bg-muted/30">
                        {metric}
                    </span>
                </div>
                <div className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${statusColors[status]}`}>
                    {statusLabels[status]}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-auto border-t border-border/50 pt-4">
                <div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Baseline</div>
                    <div className="font-bold">{baseline}</div>
                </div>
                <div className="border-x border-border/50">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current</div>
                    <div className="font-bold text-primary">{current}</div>
                </div>
                <div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Target</div>
                    <div className="font-bold">{target}</div>
                </div>
            </div>
        </div>
    );
}
