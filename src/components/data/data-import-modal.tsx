"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SourceColumn {
  name: string;
  type: string;
  mapped?: boolean;
}

interface MappedField {
  label: string;
  icon: string;
  field: string;
  filled: boolean;
}

interface DataImportModalProps {
  fileName?: string;
  fileSize?: string;
  sourceColumns?: SourceColumn[];
  mappedFields?: MappedField[];
  onClose?: () => void;
}

export function DataImportModal({
  fileName = "water_analysis_q3.csv",
  fileSize = "142 KB",
  sourceColumns = [
    { name: "DATE_LOGGED", type: "DATE" },
    { name: "PH_LEVEL", type: "NUM", mapped: true },
    { name: "TURBIDITY", type: "NUM", mapped: true },
    { name: "LOCATION_ID", type: "TXT" },
    { name: "OPERATOR", type: "TXT" },
  ],
  mappedFields = [
    { label: "X-Axis (Time Series)", icon: "calendar_today", field: "", filled: false },
    { label: "Y-Axis (Value)", icon: "water_drop", field: "PH_LEVEL", filled: true },
    { label: "Secondary Y-Axis (Optional)", icon: "opacity", field: "TURBIDITY", filled: true },
    { label: "Grouping / Legend", icon: "category", field: "", filled: false },
  ],
  onClose,
}: DataImportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-[1px] p-4">
      <div className="w-full max-w-[800px] bg-card border border-border flex flex-col max-h-[90vh] shadow-[4px_4px_0px_0px_#D8D4CD]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-muted-foreground">database</span>
            <h2 className="text-xl font-display font-bold text-foreground tracking-tight">
              Data Import // Widget Configurator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          {/* Stage 1: Source File */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline mb-2">
              <label className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                01. Source File
              </label>
              <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5">
                {fileName} (Parsed)
              </span>
            </div>
            <div className="group flex items-center justify-between p-3 border border-border bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-border/50 p-2 text-muted-foreground">
                  <span className="material-symbols-outlined text-lg">description</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{fileName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{fileSize} &bull; Uploaded just now</p>
                </div>
              </div>
              <button className="text-xs font-bold text-muted-foreground uppercase hover:text-primary transition-colors pr-2">
                Replace
              </button>
            </div>
          </div>

          {/* Stage 2: Mapping Interface */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-end border-b border-border pb-2">
              <label className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                02. Map Data Fields
              </label>
              <span className="text-xs text-muted-foreground italic">Drag columns to widget properties</span>
            </div>

            <div className="grid grid-cols-12 gap-8 h-full">
              {/* Source Columns */}
              <div className="col-span-5 flex flex-col gap-3">
                <h3 className="text-sm font-display font-semibold text-foreground mb-1">Source Columns</h3>
                <div className="flex flex-col gap-2 p-4 bg-primary/5 border border-border border-dashed min-h-[240px]">
                  {sourceColumns.map((col) => (
                    <div
                      key={col.name}
                      className={cn(
                        "bg-card border border-border p-2 shadow-sm hover:shadow-md hover:border-primary/50 cursor-grab active:cursor-grabbing flex items-center gap-2 group transition-all",
                        col.mapped && "opacity-50"
                      )}
                    >
                      <span className="material-symbols-outlined text-muted-foreground text-base group-hover:text-primary">
                        {col.mapped ? "check" : "drag_indicator"}
                      </span>
                      <span className={cn("font-mono text-xs font-medium text-foreground", col.mapped && "line-through")}>
                        {col.name}
                      </span>
                      <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Arrow */}
              <div className="col-span-2 flex flex-col items-center justify-center text-border">
                <span className="material-symbols-outlined text-4xl animate-pulse">arrow_right_alt</span>
              </div>

              {/* Widget Config */}
              <div className="col-span-5 flex flex-col gap-3">
                <h3 className="text-sm font-display font-semibold text-foreground mb-1">Widget Config (Line Chart)</h3>
                <div className="flex flex-col gap-3">
                  {mappedFields.map((mf, i) => (
                    <div key={i} className="relative">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">{mf.label}</label>
                      {mf.filled ? (
                        <div className="h-12 border border-primary bg-card flex items-center justify-between px-3 shadow-sm relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">{mf.icon}</span>
                            <span className="font-mono text-xs font-bold text-foreground">{mf.field}</span>
                          </div>
                          <button className="text-muted-foreground hover:text-eco-clay">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 border-2 border-dashed border-border bg-background flex items-center justify-center transition-colors hover:border-primary hover:bg-primary/5">
                          <span className="text-xs text-muted-foreground font-mono">
                            {mf.label.includes("Time") ? "Drop Date Field" : "Drop Category Field"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 3: Preview */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
              03. Widget Preview
            </label>
            <div className="border border-border p-4 bg-card relative overflow-hidden h-40 flex items-center justify-center">
              {/* Grid background */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Chart */}
              <div className="relative w-full h-full z-10 flex items-end justify-between px-4 pb-4 pt-8">
                <div className="absolute left-2 top-2 bottom-4 flex flex-col justify-between text-[9px] font-mono text-muted-foreground h-full py-2">
                  <span>14.0</span>
                  <span>7.0</span>
                  <span>0.0</span>
                </div>
                <svg className="w-full h-full overflow-visible ml-6" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path d="M0,25 Q10,20 20,28 T40,22 T60,25 T80,18 T100,24" fill="none" stroke="#10cb30" strokeWidth="2" />
                  <path d="M0,40 Q15,35 30,38 T50,32 T70,42 T100,38" fill="none" stroke="#C49B55" strokeDasharray="2,1" strokeWidth="2" />
                </svg>
              </div>
              {/* Tooltip */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-foreground text-white text-[10px] font-mono py-1 px-2 shadow-lg">
                pH: 7.2 | Turb: 4.1
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background flex justify-between items-center">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-border/20 transition-colors">
            Cancel Import
          </button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 text-sm font-bold">
              <span className="material-symbols-outlined text-base">settings</span>
              Advanced Options
            </Button>
            <Button className="flex items-center gap-2 px-6 text-sm font-bold">
              <span className="material-symbols-outlined text-base">check</span>
              Generate Widget
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
