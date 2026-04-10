export function ChartWidget() {
  return (
    <div className="bg-card border border-border p-6 flex flex-col group hover:border-primary transition-colors relative h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground leading-tight">
            Water Quality Analysis
          </h3>
          <p className="text-sm text-muted-foreground">pH Levels across Sector 7 (Q1-Q3)</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full flex items-end justify-between gap-2 px-2 pb-2 border-l border-b border-border relative min-h-[240px]">
        {/* Grid Lines */}
        <div className="absolute left-0 right-0 top-[20%] h-px bg-background border-t border-dashed border-border/50" />
        <div className="absolute left-0 right-0 top-[40%] h-px bg-background border-t border-dashed border-border/50" />
        <div className="absolute left-0 right-0 top-[60%] h-px bg-background border-t border-dashed border-border/50" />
        <div className="absolute left-0 right-0 top-[80%] h-px bg-background border-t border-dashed border-border/50" />

        {/* Line Chart SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#10cb30", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#10cb30", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,60 450,90 C500,120 550,40 600,60 L600,240 L0,240 Z"
            fill="url(#chartGradient)"
            opacity="0.1"
          />
          <path
            d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,60 450,90 C500,120 550,40 600,60"
            fill="none"
            stroke="#10cb30"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Tooltip */}
        <div className="absolute top-[30%] left-[48%] bg-foreground text-white text-[10px] font-mono px-2 py-1 z-10">
          pH: 7.2
        </div>
        <div className="absolute top-[34%] left-[50%] w-px h-[66%] bg-foreground/20 border-l border-dashed border-foreground" />
        <div className="absolute top-[34%] left-[50%] size-2 bg-primary border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
      </div>

      {/* X-Axis */}
      <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-muted-foreground uppercase">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
      </div>
    </div>
  );
}
