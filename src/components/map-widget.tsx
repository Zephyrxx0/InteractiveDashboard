export function MapWidget() {
  return (
    <div className="bg-card border border-border p-0 flex flex-col group hover:border-primary transition-colors relative overflow-hidden h-full">
      {/* Overlay Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 bg-gradient-to-b from-card/80 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground leading-tight">
              Deployment Map
            </h3>
            <p className="text-sm text-muted-foreground">Active Zones: South America</p>
          </div>
          <button className="bg-white/80 p-1 hover:bg-white transition-colors border border-border backdrop-blur">
            <span className="material-symbols-outlined text-[18px]">open_in_full</span>
          </button>
        </div>
      </div>

      {/* Map Image */}
      <div className="flex-1 w-full h-full bg-background relative min-h-[300px]">
        <img
          alt="Map showing green zones overlaid on dark terrain"
          className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQDS_tK0EZU6LYBDHYZiwg4nn-lJPyRAhe_X6wJ9pfOJDjsqXYDqL63fXhvzAj_qll0PSk3TAGpN9pEtGIuScC_CI6GvXoHwjfxHBH74-jBbpeddiW1QnW09GKyCq0ekYH3jZtF9q_CkMjuz-FMf4S34gkwtOz5CoQJH7VLWbfaDqtx-RufwTDW1yvmNaqH-YMpMjcNgoMxfspIcHh678I2CdJlvk1U1q95ZEnQzzvwKMhf-k3hyO5SctwEx36Qu5mHXHGDX5pzuIG"
        />
        {/* Map Markers */}
        <div className="absolute top-[40%] left-[30%] group/marker cursor-pointer">
          <div className="size-3 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-mono px-2 py-1 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-20">
            Sector 4: Active
          </div>
        </div>
        <div className="absolute top-[60%] left-[55%] group/marker cursor-pointer">
          <div className="size-3 bg-eco-ochre rounded-full" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-mono px-2 py-1 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-20">
            Sector 2: Review
          </div>
        </div>
      </div>
    </div>
  );
}
