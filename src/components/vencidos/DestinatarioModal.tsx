'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { DestinatarioVencidos } from '@/types/vencido';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface DestinatarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DestinatarioVencidos) => void;
  initialData?: DestinatarioVencidos | null;
}

const defaultData: DestinatarioVencidos = {
  razaoSocial: '',
  cnpj: '',
  endereco: '',
  cidade: '',
  cep: '',
};

export function DestinatarioModal({ open, onOpenChange, onSave, initialData }: DestinatarioModalProps) {
  const [formData, setFormData] = useState(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const hasChanges = useMemo(() => {
    return JSON.stringify(initialData || defaultData) !== JSON.stringify(formData);
  }, [initialData, formData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.razaoSocial.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveClick = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };
  
  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onOpenChange(false);
    }
  }

  const FormContent = () => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social *</Label>
            <Input id="razaoSocial" value={formData.razaoSocial} onChange={e => handleInputChange('razaoSocial', e.target.value)} className={cn(errors.razaoSocial && 'border-destructive')} />
            {errors.razaoSocial && <p className="text-xs text-destructive">{errors.razaoSocial}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input id="cnpj" value={formData.cnpj} onChange={e => handleInputChange('cnpj', e.target.value)} className={cn(errors.cnpj && 'border-destructive')} />
            {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input id="endereco" value={formData.endereco} onChange={e => handleInputChange('endereco', e.target.value)} className={cn(errors.endereco && 'border-destructive')} />
            {errors.endereco && <p className="text-xs text-destructive">{errors.endereco}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="cidade">Cidade *</Label>
            <Input id="cidade" value={formData.cidade} onChange={e => handleInputChange('cidade', e.target.value)} className={cn(errors.cidade && 'border-destructive')} />
            {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <Input id="cep" value={formData.cep} onChange={e => handleInputChange('cep', e.target.value)} className={cn(errors.cep && 'border-destructive')} />
            {errors.cep && <p className="text-xs text-destructive">{errors.cep}</p>}
        </div>
        
        <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Descartar Alterações?</AlertDialogTitle>
                <AlertDialogDescription>
                Você tem alterações não salvas. Deseja mesmo descartar?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Continuar Editando</AlertDialogCancel>
                <AlertDialogAction onClick={() => onOpenChange(false)}>Descartar</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );

  const title = 'Editar Destinatário';
  const description = 'Informe os dados do destinatário para a Nota Fiscal de Devolução (NFD).';

  if (isMobile) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">{FormContent()}</div>
                <DrawerFooter>
                    <Button onClick={handleSaveClick} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 animate-spin" /> : null} Salvar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {FormContent()}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin" /> : null} Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
