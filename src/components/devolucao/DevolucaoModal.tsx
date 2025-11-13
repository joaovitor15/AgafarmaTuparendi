'use client';

import { useState, useEffect } from 'react';
import type { Devolucao, DevolucaoProduto } from '@/types';
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
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type DevolucaoFormData = Omit<Devolucao, 'id' | 'status' | 'dataRealizada'> & {
    produtos: (DevolucaoProduto & { tempId: string })[];
};

interface DevolucaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (devolucao: Omit<Devolucao, 'id'>) => void;
}

const initialFormData: DevolucaoFormData = {
  notaFiscalEntrada: '',
  produtos: [{ tempId: uuidv4(), nome: '', quantidade: 1 }],
  distribuidora: '',
  motivo: '',
  protocolo: '',
};

export function DevolucaoModal({
  open,
  onOpenChange,
  onSave,
}: DevolucaoModalProps) {
  const [formData, setFormData] = useState<DevolucaoFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProdutoChange = (tempId: string, field: 'nome' | 'quantidade', value: string | number) => {
    setFormData(prev => ({
        ...prev,
        produtos: prev.produtos.map(p => p.tempId === tempId ? { ...p, [field]: value } : p)
    }));
  };

  const handleAddProduto = () => {
    setFormData(prev => ({
        ...prev,
        produtos: [...prev.produtos, { tempId: uuidv4(), nome: '', quantidade: 1 }]
    }));
  };

  const handleRemoveProduto = (tempId: string) => {
    setFormData(prev => ({
        ...prev,
        produtos: prev.produtos.filter(p => p.tempId !== tempId)
    }));
  }

  const validate = () => {
    const newErrors: Record<string, any> = {};
    if (!formData.notaFiscalEntrada) newErrors.notaFiscalEntrada = 'NF de Entrada é obrigatória.';
    if (!formData.distribuidora) newErrors.distribuidora = 'Distribuidora é obrigatória.';
    if (!formData.motivo) newErrors.motivo = 'Motivo é obrigatório.';

    const produtosErrors: Record<string, { nome?: string, quantidade?: string }> = {};
    if (formData.produtos.length === 0) {
        newErrors.produtos_geral = 'Adicione pelo menos um produto.';
    } else {
        formData.produtos.forEach(p => {
            const produtoError: { nome?: string, quantidade?: string } = {};
            if (!p.nome.trim()) {
                produtoError.nome = 'Nome do produto é obrigatório.';
            }
            if ((p.quantidade || 0) <= 0) {
                produtoError.quantidade = 'Qtd. deve ser > 0.';
            }
            if (Object.keys(produtoError).length > 0) {
                produtosErrors[p.tempId] = produtoError;
            }
        });
    }

    if (Object.keys(produtosErrors).length > 0) {
        newErrors.produtos = produtosErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validate()) {
        const { produtos, ...rest } = formData;
        const finalProdutos = produtos.map(({ tempId, ...p }) => p);
      onSave({ 
        ...rest, 
        produtos: finalProdutos, 
        status: 'solicitacao_nfd',
        dataRealizada: new Date().toISOString(),
      });
    }
  };

  const FormContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="notaFiscalEntrada">NF*</Label>
            <Input id="notaFiscalEntrada" name="notaFiscalEntrada" placeholder="Número da NF" value={formData.notaFiscalEntrada || ''} onChange={handleInputChange} />
            {errors.notaFiscalEntrada && <p className="text-xs text-destructive">{errors.notaFiscalEntrada}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="distribuidora">Distribuidora*</Label>
            <Input id="distribuidora" name="distribuidora" placeholder="Nome da distribuidora" value={formData.distribuidora || ''} onChange={handleInputChange} />
            {errors.distribuidora && <p className="text-xs text-destructive">{errors.distribuidora}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo*</Label>
        <Input id="motivo" name="motivo" placeholder="Motivo da devolução" value={formData.motivo || ''} onChange={handleInputChange} />
        {errors.motivo && <p className="text-xs text-destructive">{errors.motivo}</p>}
      </div>

      <div className="space-y-2">
        <Label>Produtos*</Label>
        <div className='space-y-3 rounded-lg border p-3'>
            {formData.produtos.map((produto, index) => (
                <div key={produto.tempId} className='flex items-end gap-2'>
                    <div className='flex-grow space-y-1'>
                        <Label htmlFor={`produto_nome_${produto.tempId}`} className='text-xs'>Produto {index + 1}</Label>
                        <Input 
                            id={`produto_nome_${produto.tempId}`}
                            value={produto.nome}
                            onChange={(e) => handleProdutoChange(produto.tempId, 'nome', e.target.value)}
                            placeholder='Nome do medicamento'
                        />
                         {errors.produtos?.[produto.tempId]?.nome && <p className="text-xs text-destructive">{errors.produtos[produto.tempId].nome}</p>}
                    </div>
                     <div className='space-y-1'>
                        <Label htmlFor={`produto_qtd_${produto.tempId}`} className='text-xs'>Qtd</Label>
                        <Input 
                            id={`produto_qtd_${produto.tempId}`}
                            type="number"
                            value={produto.quantidade}
                            onChange={(e) => handleProdutoChange(produto.tempId, 'quantidade', parseInt(e.target.value) || 1)}
                            className='w-20'
                        />
                        {errors.produtos?.[produto.tempId]?.quantidade && <p className="text-xs text-destructive">{errors.produtos[produto.tempId].quantidade}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveProduto(produto.tempId)} disabled={formData.produtos.length <= 1}>
                        <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                </div>
            ))}
             <Button variant="secondary" size="sm" onClick={handleAddProduto} className='w-full'>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
            </Button>
            {errors.produtos_geral && <p className="text-xs text-destructive">{errors.produtos_geral}</p>}
        </div>
      </div>
    </>
  );

  const title = 'Iniciar Nova Devolução';
  const description = 'Preencha os dados completos para iniciar o processo de devolução.';

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='max-h-[70vh]'>
            <div className="px-4 space-y-4">{FormContent()}</div>
          </ScrollArea>
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
         <ScrollArea className='max-h-[60vh]'>
            <div className="space-y-4 pr-6">{FormContent()}</div>
        </ScrollArea>
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
