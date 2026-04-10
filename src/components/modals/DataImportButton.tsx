'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataImportModal } from './DataImportModal';

export function DataImportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <span className="material-symbols-outlined text-[18px] mr-2">smart_toy</span>
        Import via AI
      </Button>
      <DataImportModal open={open} onOpenChange={setOpen} />
    </>
  );
}
