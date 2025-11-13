'use client';

import { useState, useEffect } from 'react';
import type { Devolucao } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';

interface DevolucaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (devolucao: Partial<Devolucao>) => void;
  isCreating: boolean;
}

export function DevolucaoModal({
  open,
  onOpenChange,
  onSave,
  isCreating,
}: DevolucaoModalProps) {
  const [formData, setFormData] = useState<Partial<Devolucao>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (open) {
      setFormData({});
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.dataRealizada) newErrors.dataRealizada = 'Data é obrigatória.';
    if (!formData.notaFiscalEntrada) newErrors.notaFiscalEntrada = 'NF de Entrada é obrigatória.';
    if (!formData.distribuidora) newErrors.distribuidora = 'Distribuidora é obrigatória.';
    if (!formData.motivo) newErrors.motivo = 'Motivo é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const FormContent = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="dataRealizada">Data da Solicitação</Label>
        <Input id="dataRealizada" name="dataRealizada" type="date" value={formData.dataRealizada || ''} onChange={handleInputChange} />
        {errors.dataRealizada && <p className="text-xs text-destructive">{errors.dataRealizada}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notaFiscalEntrada">NF de Entrada Original</Label>
        <Input id="notaFiscalEntrada" name="notaFiscalEntrada" placeholder="Número da NF de compra" value={formData.notaFiscalEntrada || ''} onChange={handleInputChange} />
        {errors.notaFiscalEntrada && <p className="text-xs text-destructive">{errors.notaFiscalEntrada}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="distribuidora">Distribuidora</Label>
        <Input id="distribuidora" name="distribuidora" value={formData.distribuidora || ''} onChange={handleInputChange} />
        {errors.distribuidora && <p className="text-xs text-destructive">{errors.distribuidora}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo da Devolução</Label>
        <Input id="motivo" name="motivo" value={formData.motivo || ''} onChange={handleInputChange} />
        {errors.motivo && <p className="text-xs text-destructive">{errors.motivo}</p>}
      </div>
    </>
  );

  const title = 'Iniciar Nova Devolução';
  const description = 'Preencha os dados iniciais. Os detalhes dos produtos serão adicionados no próximo passo.';

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-4">{FormContent()}</div>
          <DrawerFooter className="pt-2">
             <Button onClick={handleSaveClick}>Criar Devolução</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{FormContent()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveClick}>Criar Devolução</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
