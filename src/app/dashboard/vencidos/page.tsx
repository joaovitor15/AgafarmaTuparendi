'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X, FileDown, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

// Estrutura de dados para um item vencido
interface VencidoItem {
  id: string;
  medicamento: string;
  laboratorio: string;
  quantidade: number;
  lote: string;
  codigoBarras: string;
  msRegistro: string;
  ncm: string;
  cest: string;
  cfop: string;
  precoUnitario: number;
}

// Estado inicial para o formulário
const initialFormState: Omit<VencidoItem, 'id'> = {
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
};

// Componente da página de Vencidos
export default function VencidosPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [items, setItems] = useState<VencidoItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPDF, setLoadingPDF] = useState(false);

  const totalCalculado = useMemo(() => {
    return (formData.quantidade || 0) * (formData.precoUnitario || 0);
  }, [formData.quantidade, formData.precoUnitario]);

  const handleInputChange = (field: keyof typeof initialFormState, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleValorChange = (rawValue: string) => {
    let value = rawValue.replace(/\D/g, '');
    if (value === '') {
      handleInputChange('precoUnitario', 0);
      return;
    }
    const numericValue = parseInt(value) / 100;
    handleInputChange('precoUnitario', numericValue);
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

  const handleAddItem = () => {
    if (validate()) {
      setItems(prev => [{ id: uuidv4(), ...formData }, ...prev]);
      handleClearForm();
      document.getElementById('medicamento')?.focus();
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearForm = () => {
    setFormData(initialFormState);
    setErrors({});
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">VENCIDOS</h1>
      
      <Card>
        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Linha 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[30fr_25fr_20fr_20fr_5fr] gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="medicamento">Medicamento *</Label>
              <Input id="medicamento" value={formData.medicamento} onChange={e => handleInputChange('medicamento', e.target.value)} placeholder="Nome do medicamento" className={cn(errors.medicamento && 'border-destructive')} />
              {errors.medicamento && <p className="text-xs text-destructive">{errors.medicamento}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="laboratorio">Laboratório *</Label>
              <Input id="laboratorio" value={formData.laboratorio} onChange={e => handleInputChange('laboratorio', e.target.value)} placeholder="Laboratório" className={cn(errors.laboratorio && 'border-destructive')} />
              {errors.laboratorio && <p className="text-xs text-destructive">{errors.laboratorio}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input id="quantidade" type="number" value={formData.quantidade} onChange={e => handleInputChange('quantidade', parseInt(e.target.value) || 1)} placeholder="Qtd" className={cn(errors.quantidade && 'border-destructive')} />
              {errors.quantidade && <p className="text-xs text-destructive">{errors.quantidade}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lote">Lote *</Label>
              <Input id="lote" value={formData.lote} onChange={e => handleInputChange('lote', e.target.value)} placeholder="Número do Lote" className={cn(errors.lote && 'border-destructive')} />
              {errors.lote && <p className="text-xs text-destructive">{errors.lote}</p>}
            </div>
          </div>
          
          {/* Linha 2 */}
          <div className="grid grid-cols-1 md:grid-cols-[40fr_55fr_5fr] gap-4 items-end">
             <div className="space-y-1">
              <Label htmlFor="codigoBarras">Código de Barras *</Label>
              <Input id="codigoBarras" value={formData.codigoBarras} onChange={e => handleInputChange('codigoBarras', e.target.value)} placeholder="Código de Barras (EAN)" className={cn(errors.codigoBarras && 'border-destructive')} />
              {errors.codigoBarras && <p className="text-xs text-destructive">{errors.codigoBarras}</p>}
            </div>
             <div></div>
          </div>
          
          {/* Linha 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[35fr_20fr_20fr_20fr_5fr] gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="msRegistro">MS Registro ANVISA *</Label>
              <Input id="msRegistro" value={formData.msRegistro} onChange={e => handleInputChange('msRegistro', e.target.value)} placeholder="MS Registro" className={cn(errors.msRegistro && 'border-destructive')} />
               {errors.msRegistro && <p className="text-xs text-destructive">{errors.msRegistro}</p>}
            </div>
             <div className="space-y-1">
              <Label htmlFor="ncm">NCM *</Label>
              <Input id="ncm" value={formData.ncm} onChange={e => handleInputChange('ncm', e.target.value)} placeholder="NCM" className={cn(errors.ncm && 'border-destructive')} />
              {errors.ncm && <p className="text-xs text-destructive">{errors.ncm}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cest">CEST *</Label>
              <Input id="cest" value={formData.cest} onChange={e => handleInputChange('cest', e.target.value)} placeholder="CEST" className={cn(errors.cest && 'border-destructive')} />
              {errors.cest && <p className="text-xs text-destructive">{errors.cest}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cfop">CFOP *</Label>
              <Input id="cfop" value={formData.cfop} onChange={e => handleInputChange('cfop', e.target.value)} placeholder="CFOP" className={cn(errors.cfop && 'border-destructive')} />
              {errors.cfop && <p className="text-xs text-destructive">{errors.cfop}</p>}
            </div>
          </div>
          
          {/* Linha 4 */}
          <div className="grid grid-cols-1 md:grid-cols-[25fr_30fr_40fr_5fr] gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="precoUnitario">Preço Unitário *</Label>
              <Input id="precoUnitario" type="text" inputMode="decimal" value={formatValorParaInput(formData.precoUnitario)} onChange={e => handleValorChange(e.target.value)} placeholder="R$ 0,00" className={cn(errors.precoUnitario && 'border-destructive', 'text-right')} />
              {errors.precoUnitario && <p className="text-xs text-destructive">{errors.precoUnitario}</p>}
            </div>
            <div className="space-y-1">
              <Label>Total</Label>
              <Input value={formatCurrency(totalCalculado)} readOnly className="bg-muted/50 text-right font-bold" />
            </div>
            <div></div>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50 hover:text-destructive" onClick={handleClearForm}>
              <X className="h-5 w-5"/>
            </Button>
          </div>
          
          <div className="pt-4">
             <Button onClick={handleAddItem} className='w-full sm:w-auto'>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {items.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Itens Adicionados</h2>
          {items.map((item, index) => (
            <Card key={item.id} className="p-4 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className='flex-1'>
                        <h3 className="font-bold text-primary">Item {items.length - index}: {item.medicamento}</h3>
                        <p className='text-sm text-muted-foreground'>{item.laboratorio}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 -mt-2 -mr-2" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 mt-3 text-sm">
                    <InfoDisplay label="Cód. Barras" value={item.codigoBarras} />
                    <InfoDisplay label="Lote" value={item.lote} />
                    <InfoDisplay label="MS Registro" value={item.msRegistro} />
                    <InfoDisplay label="NCM" value={item.ncm} />
                    <InfoDisplay label="CEST" value={item.cest} />
                    <InfoDisplay label="CFOP" value={item.cfop} />
                    <InfoDisplay label="Qtd." value={item.quantidade.toString()} />
                    <InfoDisplay label="Preço Unit." value={formatCurrency(item.precoUnitario)} />
                    <div className='font-bold'>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className='text-base'>{formatCurrency(item.quantidade * item.precoUnitario)}</p>
                    </div>
                </div>
            </Card>
          ))}
        </div>
      )}

      {items.length === 0 && (
         <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Nenhum item adicionado ainda.</p>
        </div>
      )}

       <div className="pt-4">
        <Button disabled={items.length === 0 || loadingPDF}>
            {loadingPDF ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : <FileDown className="mr-2 h-4 w-4" />}
            Gerar PDF de Vencidos
        </Button>
      </div>

    </div>
  );
}

const InfoDisplay = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{value}</p>
    </div>
);
