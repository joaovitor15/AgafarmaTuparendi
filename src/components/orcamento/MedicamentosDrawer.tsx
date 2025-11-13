'use client';

import { useMemo } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer';
import type { Medicamento } from '@/types/orcamento';

interface MedicamentosDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicamentos: Medicamento[];
  pacienteName: string;
  trigger: React.ReactNode;
}

export function MedicamentosDrawer({
  open,
  onOpenChange,
  medicamentos,
  pacienteName,
  trigger,
}: MedicamentosDrawerProps) {
  
  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, []);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Medicamentos - {pacienteName}</DrawerTitle>
           <DrawerDescription>
            Lista de medicamentos incluídos neste orçamento.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 p-4 pb-8 max-h-[70vh] overflow-y-auto">
          {medicamentos.map((med) => (
            <div
              key={med.id || med.nome}
              className="flex justify-between items-start p-3 bg-muted/50 rounded-lg border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{med.nome}</p>
                {med.principioAtivo && (
                  <p className="text-xs text-muted-foreground mt-1">{med.principioAtivo}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Qtd: {med.quantidadeMensal}/mês • {med.quantidadeTratamento} total
                </p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-semibold text-primary">
                  {formatCurrency.format(med.valorUnitario)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
