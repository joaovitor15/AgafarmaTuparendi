'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Save, X } from 'lucide-react';
import type { VencidoItem } from '@/types/vencido';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VencidoFormProps {
  onSave: (data: Omit<VencidoItem, 'id' | 'dataCriacao' | 'dataUltimaEdicao'>) => Promise<void>;
  initialData?: VencidoItem;
  isEditing?: boolean;
}

export function VencidoForm({ onSave, initialData, isEditing = false }: VencidoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    medicamento: '',
    laboratorio: '',
    quantidade: 1,
    lote: '',
    codigoBarras: '',
    msRegistro: '',
    ncm: '',
    cest: '',
    cfop: '',
    precoUnitario: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const hasChanges = useMemo(() => {
    if (!initialData) return Object.values(formData).some(v => {
      if (typeof v === 'string') return v !== '';
      if (typeof v === 'number') return v !== 0 && v !== 1;
      return false;
    });
    return JSON.stringify(initialData) !== JSON.stringify(formData);
  }, [initialData, formData]);
  
  const totalCalculado = useMemo(() => {
    return (formData.quantidade || 0) * (formData.precoUnitario || 0);
  }, [formData.quantidade, formData.precoUnitario]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleValorChange = (rawValue: string) => {
    let value = rawValue.replace(/\D/g, '');
    if (value === '') {
        handleInputChange('precoUnitario', 0);
        return;
    }
    if (rawValue.endsWith(',') || rawValue.endsWith('.')) {
        value = value + '00';
    }
    const numericValue = parseInt(value, 10) / 100;
    handleInputChange('precoUnitario', isNaN(numericValue) ? 0 : numericValue);
  };
  
  const formatValorParaInput = (value: number): string => {
    if (!value || value === 0) return '';
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.medicamento.trim()) newErrors.medicamento = 'Medicamento é obrigatório';
    if (!formData.laboratorio.trim()) newErrors.laboratorio = 'Laboratório é obrigatório';
    if ((formData.quantidade || 0) <= 0) newErrors.quantidade = 'Qtd. deve ser > 0';
    if (!formData.lote.trim()) newErrors.lote = 'Lote é obrigatório';
    if (!formData.codigoBarras.trim()) newErrors.codigoBarras = 'Código de Barras é obrigatório';
    if (!formData.msRegistro.trim()) newErrors.msRegistro = 'MS Registro é obrigatório';
    if (!formData.ncm.trim()) newErrors.ncm = 'NCM é obrigatório';
    if (!formData.cest.trim()) newErrors.cest = 'CEST é obrigatório';
    if (!formData.cfop.trim()) newErrors.cfop = 'CFOP é obrigatório';
    if ((formData.precoUnitario || 0) <= 0) newErrors.precoUnitario = 'Preço deve ser > 0';
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
      router.push('/dashboard/vencidos');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full" onClick={handleCancel}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Editar Item Vencido' : 'Adicionar Novo Item Vencido'}
        </h1>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
            <CardDescription>Informações básicas do medicamento.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicamento">Medicamento *</Label>
              <Input id="medicamento" value={formData.medicamento} onChange={e => handleInputChange('medicamento', e.target.value)} className={cn(errors.medicamento && 'border-destructive')} />
              {errors.medicamento && <p className="text-xs text-destructive">{errors.medicamento}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="laboratorio">Laboratório *</Label>
              <Input id="laboratorio" value={formData.laboratorio} onChange={e => handleInputChange('laboratorio', e.target.value)} className={cn(errors.laboratorio && 'border-destructive')} />
              {errors.laboratorio && <p className="text-xs text-destructive">{errors.laboratorio}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lote e Código</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="lote">Lote *</Label>
              <Input id="lote" value={formData.lote} onChange={e => handleInputChange('lote', e.target.value)} className={cn(errors.lote && 'border-destructive')} />
              {errors.lote && <p className="text-xs text-destructive">{errors.lote}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigoBarras">Código de Barras *</Label>
              <Input id="codigoBarras" value={formData.codigoBarras} onChange={e => handleInputChange('codigoBarras', e.target.value)} className={cn(errors.codigoBarras && 'border-destructive')} />
              {errors.codigoBarras && <p className="text-xs text-destructive">{errors.codigoBarras}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Fiscais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="msRegistro">MS Registro *</Label>
              <Input id="msRegistro" value={formData.msRegistro} onChange={e => handleInputChange('msRegistro', e.target.value)} className={cn(errors.msRegistro && 'border-destructive')} />
              {errors.msRegistro && <p className="text-xs text-destructive">{errors.msRegistro}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ncm">NCM *</Label>
              <Input id="ncm" value={formData.ncm} onChange={e => handleInputChange('ncm', e.target.value)} className={cn(errors.ncm && 'border-destructive')} />
              {errors.ncm && <p className="text-xs text-destructive">{errors.ncm}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cest">CEST *</Label>
              <Input id="cest" value={formData.cest} onChange={e => handleInputChange('cest', e.target.value)} className={cn(errors.cest && 'border-destructive')} />
              {errors.cest && <p className="text-xs text-destructive">{errors.cest}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="cfop">CFOP *</Label>
              <Input id="cfop" value={formData.cfop} onChange={e => handleInputChange('cfop', e.target.value)} className={cn(errors.cfop && 'border-destructive')} />
              {errors.cfop && <p className="text-xs text-destructive">{errors.cfop}</p>}
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Quantidade e Preços</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input id="quantidade" type="number" value={formData.quantidade} onChange={e => handleInputChange('quantidade', parseInt(e.target.value) || 1)} className={cn(errors.quantidade && 'border-destructive')} />
              {errors.quantidade && <p className="text-xs text-destructive">{errors.quantidade}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="precoUnitario">Preço Unitário *</Label>
              <Input id="precoUnitario" type="text" inputMode="decimal" value={formatValorParaInput(formData.precoUnitario)} onChange={e => handleValorChange(e.target.value)} className={cn(errors.precoUnitario && 'border-destructive', 'text-right')} />
              {errors.precoUnitario && <p className="text-xs text-destructive">{errors.precoUnitario}</p>}
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCalculado)} readOnly className="bg-muted/50 text-right font-bold tabular-nums" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
            <Button type="submit" onClick={handleSaveClick} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                Salvar
            </Button>
        </div>
      </form>
      
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar Alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Deseja mesmo descartar e voltar para a lista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Editando</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/dashboard/vencidos')}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
