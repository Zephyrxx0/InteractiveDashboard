"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface FilterGroup {
  title: string;
  options: { label: string; checked?: boolean; indicator?: string }[];
}

interface FilterSidebarProps {
  groups: FilterGroup[];
}

export function FilterSidebar({ groups }: FilterSidebarProps) {
  return (
    <aside className="w-[240px] flex-none bg-card border-r border-border overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="font-display font-semibold text-lg uppercase tracking-tight">Filters</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1 uppercase">Refine Selection</p>
      </div>

      {groups.map((group, i) => (
        <div key={i} className="p-6 border-b border-border space-y-4">
          <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">
            {group.title}
          </h3>
          <div className="space-y-3">
            {group.options.map((option, j) => (
              <label key={j} className="flex items-center gap-3 group cursor-pointer">
                <Checkbox
                  defaultChecked={option.checked}
                  className="size-4 border-border rounded-none data-[state=checked]:bg-eco-sage data-[state=checked]:border-eco-sage"
                />
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors data-[checked]:text-foreground">
                  {option.indicator && (
                    <span className={`size-2 block ${option.indicator}`} />
                  )}
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto p-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full h-10 font-mono text-xs uppercase font-bold"
        >
          Reset Filters
        </Button>
      </div>
    </aside>
  );
}
