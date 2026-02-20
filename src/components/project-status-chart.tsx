export function ProjectStatusChart() {
  return (
    <div className="bg-card border border-border p-6 flex flex-col group hover:border-primary transition-colors relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">Project Status</h3>
        <span className="material-symbols-outlined text-muted-foreground">pie_chart</span>
      </div>
      <div className="flex flex-row items-center gap-6 h-full">
        {/* CSS Conic Gradient Pie Chart */}
        <div
          className="size-32 rounded-full shrink-0 relative"
          style={{
            background: "conic-gradient(#10cb30 0% 60%, #C49B55 60% 85%, #D8D4CD 85% 100%)",
          }}
        >
          <div className="absolute inset-0 m-[16px] bg-card rounded-full flex items-center justify-center">
            <span className="font-display font-bold text-xl">12</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="size-3 bg-primary" />
              <span className="text-foreground font-medium">Active</span>
            </div>
            <span className="font-mono text-muted-foreground">60%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="size-3 bg-eco-ochre" />
              <span className="text-foreground font-medium">On Hold</span>
            </div>
            <span className="font-mono text-muted-foreground">25%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="size-3 bg-border" />
              <span className="text-foreground font-medium">Completed</span>
            </div>
            <span className="font-mono text-muted-foreground">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
