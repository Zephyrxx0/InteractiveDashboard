import Link from "next/link";

export function Toolbar() {
  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Left Controls */}
      <div className="flex items-center gap-4">
        <Link
          href="/import"
          className="flex items-center gap-2 px-4 h-9 bg-primary text-foreground font-mono text-xs font-bold uppercase border border-primary hover:bg-eco-primary-dark hover:border-eco-primary-dark transition-all shadow-[4px_4px_0px_0px_#D8D4CD] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Import Data
        </Link>
        <div className="h-6 w-[1px] bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground uppercase">View:</span>
          <button className="flex items-center gap-2 px-3 h-9 bg-card border border-border font-display text-sm hover:border-foreground transition-colors">
            Global Impact
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </div>
      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground uppercase hidden sm:inline">Last sync: 2m ago</span>
        <div className="flex items-center bg-card border border-border p-0.5">
          <button className="px-3 py-1 bg-foreground text-white font-mono text-xs font-medium uppercase">Grid</button>
          <button className="px-3 py-1 text-muted-foreground hover:text-foreground font-mono text-xs font-medium uppercase">List</button>
        </div>
        <button
          className="flex items-center justify-center size-9 bg-card border border-border text-foreground hover:bg-background transition-colors"
          title="Edit Grid Layout"
        >
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
        </button>
      </div>
    </div>
  );
}
