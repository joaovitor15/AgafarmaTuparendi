'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Medicamento } from '@/types/orcamento';

interface MedicamentosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicamentos: Medicamento[];
  pacienteName: string;
}

export function MedicamentosModal({
  open,
  onOpenChange,
  medicamentos,
  pacienteName,
}: MedicamentosModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Medicamentos - {pacienteName}</DialogTitle>
          <DialogDescription>
            Lista de medicamentos incluídos neste orçamento.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
          {medicamentos.map((med) => (
            <div
              key={med.id}
              className="flex justify-between items-start p-3 bg-muted/50 rounded-lg border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{med.nome}</p>
                {med.principioAtivo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {med.principioAtivo}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Qtd: {med.quantidadeMensal}/mês • {med.quantidadeTratamento} total
                </p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-semibold text-primary">
                  {formatCurrency(med.valorUnitario)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
