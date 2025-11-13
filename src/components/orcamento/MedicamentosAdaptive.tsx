'use client';

import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MedicamentosModal } from '@/components/orcamento/MedicamentosModal';
import { MedicamentosDrawer } from '@/components/orcamento/MedicamentosDrawer';
import type { Medicamento } from '@/types/orcamento';

interface MedicamentosAdaptiveProps {
  medicamentos: Medicamento[];
  pacienteName: string;
}

export function MedicamentosAdaptive({ medicamentos, pacienteName }: MedicamentosAdaptiveProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const trigger = (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
    >
      {medicamentos.length} {medicamentos.length === 1 ? 'item' : 'itens'}
    </button>
  );

  if (isMobile) {
    return (
      <MedicamentosDrawer
        open={open}
        onOpenChange={setOpen}
        medicamentos={medicamentos}
        pacienteName={pacienteName}
        trigger={trigger}
      />
    );
  }

  return (
    <>
      {trigger}
      <MedicamentosModal
        open={open}
        onOpenChange={setOpen}
        medicamentos={medicamentos}
        pacienteName={pacienteName}
      />
    </>
  );
}
