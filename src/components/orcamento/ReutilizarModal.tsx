'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/components/ui/drawer';
import type { Orcamento } from '@/types/orcamento';
import { Copy, Edit, Loader2 } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface ReutilizarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: Orcamento;
  onDuplicar: (orcamento: Orcamento) => Promise<void>;
  loading?: boolean;
}

export function ReutilizarModal({
  open,
  onOpenChange,
  orcamento,
  onDuplicar,
  loading = false,
}: ReutilizarModalProps) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAlterar = () => {
    onOpenChange(false);
    router.push(`/dashboard/orcamento-judicial/${orcamento.id}`);
  };

  const handleDuplicar = async () => {
    await onDuplicar(orcamento);
    onOpenChange(false);
  };
  
  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, []);

  const content = (
    <>
      <DialogHeader className='text-left px-4 pt-4 md:px-0 md:pt-0'>
        <DialogTitle>Reutilizar Orçamento</DialogTitle>
        <DialogDescription>
          Você pode duplicar este orçamento para o dia de hoje ou alterar suas informações.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 p-4">
        <div className="bg-muted/50 rounded-lg p-4 border">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Paciente</p>
              <p className="font-medium text-sm">{orcamento.paciente.identificador}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Medicamentos ({orcamento.medicamentos.length})</p>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {orcamento.medicamentos.map((med) => (
                  <div key={med.id || med.nome} className="bg-background p-2 rounded text-xs border">
                     <div className="flex justify-between">
                        <p className="font-medium flex-1 pr-2">{med.nome}</p>
                        <p className="font-semibold text-primary">{formatCurrency.format(med.valorUnitario)}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
          <Button onClick={handleDuplicar} disabled={loading} variant="outline" className="flex-1 rounded-full h-10">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4 mr-2" />}
            Duplicar
          </Button>
          <Button onClick={handleAlterar} disabled={loading} className="flex-1 rounded-full h-10">
             <Edit className="h-4 w-4 mr-2" />
            Alterar
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">{content}</DialogContent>
    </Dialog>
  );
}
