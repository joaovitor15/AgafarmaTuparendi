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
import { Textarea } from '@/components/ui/textarea';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';

interface DevolucaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devolucao: Devolucao | null;
  onSave: (devolucao: Devolucao) => void;
}

export function DevolucaoModal({
  open,
  onOpenChange,
  devolucao,
  onSave,
}: DevolucaoModalProps) {
  const [formData, setFormData] = useState<Partial<Devolucao>>(devolucao || {});
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    setFormData(devolucao || { status: 'solicitacao_nfd' });
  }, [devolucao]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSaveClick = () => {
    // Adicionar validação aqui
    onSave(formData as Devolucao);
  };

  const isEditable = (field: keyof Devolucao) => {
    const status = formData.status;
    if (status === 'devolucao_finalizada') return false;

    const etapa1Fields: (keyof Devolucao)[] = ['dataRealizada', 'distribuidora', 'produto', 'quantidade', 'motivo', 'protocolo', 'notaFiscalEntrada', 'notaFiscal'];
    if (status === 'solicitacao_nfd' && etapa1Fields.includes(field)) return true;

    const etapa2Fields: (keyof Devolucao)[] = [...etapa1Fields, 'nfdNumero', 'nfdValor'];
    if (status === 'aguardar_coleta' && etapa2Fields.includes(field)) return true;
    
    if (status === 'aguardando_credito' && field === 'dataColeta') return true;

    return false;
  };
  
  const FormContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="notaFiscal">Nota Fiscal da Devolução</Label>
          <Input id="notaFiscal" name="notaFiscal" value={formData.notaFiscal || ''} onChange={handleInputChange} disabled={!isEditable('notaFiscal')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataRealizada">Data da Devolução</Label>
          <Input id="dataRealizada" name="dataRealizada" type="date" value={formData.dataRealizada || ''} onChange={handleInputChange} disabled={!isEditable('dataRealizada')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="produto">Produto</Label>
        <Input id="produto" name="produto" value={formData.produto || ''} onChange={handleInputChange} disabled={!isEditable('produto')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input id="quantidade" name="quantidade" type="number" value={formData.quantidade || ''} onChange={handleInputChange} disabled={!isEditable('quantidade')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="distribuidora">Distribuidora</Label>
          <Input id="distribuidora" name="distribuidora" value={formData.distribuidora || ''} onChange={handleInputChange} disabled={!isEditable('distribuidora')} />
        </div>
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="motivo">Motivo</Label>
        <Textarea id="motivo" name="motivo" value={formData.motivo || ''} onChange={handleInputChange} disabled={!isEditable('motivo')} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="notaFiscalEntrada">NF de Entrada Original</Label>
          <Input id="notaFiscalEntrada" name="notaFiscalEntrada" value={formData.notaFiscalEntrada || ''} onChange={handleInputChange} disabled={!isEditable('notaFiscalEntrada')} />
        </div>
         <div className="space-y-2">
          <Label htmlFor="protocolo">Protocolo (Opcional)</Label>
          <Input id="protocolo" name="protocolo" value={formData.protocolo || ''} onChange={handleInputChange} disabled={!isEditable('protocolo')} />
        </div>
      </div>

      {formData.status && ['aguardar_coleta', 'aguardando_credito', 'devolucao_finalizada'].includes(formData.status) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="nfdNumero">Número NFD</Label>
            <Input id="nfdNumero" name="nfdNumero" value={formData.nfdNumero || ''} onChange={handleInputChange} disabled={!isEditable('nfdNumero')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nfdValor">Valor NFD</Label>
            <Input id="nfdValor" name="nfdValor" type="number" placeholder="R$" value={formData.nfdValor || ''} onChange={handleInputChange} disabled={!isEditable('nfdValor')} />
          </div>
        </div>
      )}
      
      {formData.status && ['aguardando_credito', 'devolucao_finalizada'].includes(formData.status) && (
        <div className="pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="dataColeta">Data da Coleta</Label>
            <Input id="dataColeta" name="dataColeta" type="date" value={formData.dataColeta || ''} onChange={handleInputChange} disabled={!isEditable('dataColeta')} />
          </div>
        </div>
      )}
    </>
  );

  const title = devolucao?.id ? 'Editar Devolução' : 'Nova Devolução';
  const description = devolucao?.id
    ? `Editando item da NF ${devolucao.notaFiscal}`
    : 'Preencha os dados para criar uma nova devolução.';

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="max-h-[60vh] overflow-y-auto">
             <div className="px-4 space-y-4">{FormContent()}</div>
          </ScrollArea>
          <DrawerFooter className="pt-2">
             <Button onClick={handleSaveClick}>Salvar</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
            <div className="space-y-4">{FormContent()}</div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveClick}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
