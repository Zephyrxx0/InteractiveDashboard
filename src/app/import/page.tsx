import { Header } from "@/components/header";
import { DataImportModal } from "@/components/data-import-modal";

export default function DataImportPage() {
  return (
    <>
      <Header activeNav="import" />

      {/* Blurred background simulating dashboard */}
      <main className="flex-1 p-10 blur-[2px] opacity-60 pointer-events-none">
        <h1 className="text-foreground font-display text-[32px] font-bold leading-tight mb-8">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 h-40" />
          <div className="bg-card border border-border p-6 h-40" />
          <div className="bg-card border border-border p-6 h-40" />
          <div className="bg-card border border-border p-6 h-40" />
          <div className="col-span-2 bg-card border border-border p-6 h-64" />
          <div className="col-span-2 bg-card border border-border p-6 h-64" />
        </div>
      </main>

      {/* Modal Overlay */}
      <DataImportModal />
    </>
  );
}
