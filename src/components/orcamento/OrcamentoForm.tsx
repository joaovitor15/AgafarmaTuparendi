'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, RotateCcw, Loader2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Orcamento, Medicamento } from '@/types/orcamento';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { formatarCPF } from '@/lib/formatters';

interface OrcamentoFormProps {
  onSave: (orcamento: Omit<Orcamento, 'id' | 'dataCriacao' | 'status' | 'usuarioId'>) => Promise<void>;
  initialData?: Omit<Orcamento, 'id'>;
  isEditing?: boolean;
}

const initialMedicamento: Omit<Medicamento, 'id'> = {
  nome: '',
  principioAtivo: '',
  quantidadeMensal: 1,
  quantidadeTratamento: 1,
  valorUnitario: 0,
};

export function OrcamentoForm({ onSave, initialData, isEditing = false }: OrcamentoFormProps) {
  const router = useRouter();
  
  const memoizedInitialData = useMemo(() => {
    if (initialData?.medicamentos) {
      return {
        ...initialData,
        medicamentos: initialData.medicamentos.map(med => ({
          ...med,
          id: med.id || uuidv4()
        })),
      };
    }
    return initialData;
  }, [initialData]);
  
  const [paciente, setPaciente] = useState(memoizedInitialData?.paciente || { identificador: '', cpf: '' });
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(
    memoizedInitialData?.medicamentos && memoizedInitialData.medicamentos.length > 0
      ? memoizedInitialData.medicamentos
      : [{ id: uuidv4(), ...initialMedicamento }]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!paciente.identificador.trim()) {
      newErrors.paciente_identificador = 'Identificador do paciente é obrigatório';
    }
    if (medicamentos.length === 0) {
        newErrors.medicamentos = 'É necessário adicionar pelo menos um medicamento.';
    }
    medicamentos.forEach(med => {
        if (!med.nome.trim()) {
            newErrors[`med_nome_${med.id}`] = 'Nome do medicamento é obrigatório.';
        }
        if ((med.valorUnitario || 0) <= 0) {
            newErrors[`med_valor_${med.id}`] = 'Valor unitário deve ser maior que zero.';
        }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validate()) return;
    
    setIsSaving(true);
    const orcamentoData = {
      paciente: {
        ...paciente,
        cpf: paciente.cpf?.replace(/\D/g, '') || '',
      },
      medicamentos
    };

    await onSave(orcamentoData);
    setIsSaving(false);
  };

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { id: uuidv4(), ...initialMedicamento }]);
  };

  const handleRemoveMedicamento = (id: string) => {
    if (medicamentos.length > 1) {
      setMedicamentos(medicamentos.filter(med => med.id !== id));
    }
  };
  
  const handleMedicamentoChange = (id: string, field: keyof Omit<Medicamento, 'id'>, value: string | number) => {
    setMedicamentos(medicamentos.map(med => med.id === id ? { ...med, [field]: value } : med));
  };

  const handlePacienteChange = (field: 'identificador' | 'cpf', value: string) => {
    if (field === 'cpf') {
      setPaciente(prev => ({ ...prev, [field]: formatarCPF(value) }));
    } else {
      setPaciente(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleClear = () => {
    setPaciente({ identificador: '', cpf: '' });
    setMedicamentos([{ id: uuidv4(), ...initialMedicamento }]);
    setErrors({});
  };

  const onCancel = () => {
    router.push('/dashboard/orcamento-judicial');
  }

  const handleValorChange = (id: string, value: string) => {
    let rawValue = value.replace(/\D/g, '');
    let numericValue = Number(rawValue) / 100;
    handleMedicamentoChange(id, 'valorUnitario', numericValue);
  };

  const formatValorParaInput = (value: number): string => {
    return (value * 100).toFixed(0);
  };
  
  return (
    <form className="space-y-6" autoComplete="off" noValidate data-lpignore="true" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="campo-principal-orcamento">Identificador</Label>
              <Input
                id="campo-principal-orcamento"
                placeholder="Nome completo ou identificador único"
                value={paciente.identificador}
                onChange={e => handlePacienteChange('identificador', e.target.value)}
                className={cn(errors.paciente_identificador && 'border-destructive')}
                autoComplete="off"
              />
               {errors.paciente_identificador && <p className="text-xs text-destructive">{errors.paciente_identificador}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="documento-paciente">CPF (Opcional)</Label>
              <Input
                id="documento-paciente"
                placeholder="000.000.000-00"
                value={paciente.cpf}
                onChange={e => handlePacienteChange('cpf', e.target.value)}
                maxLength={14}
                autoComplete="off"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medicamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicamentos.map((med) => (
              <div key={med.id} className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 p-3 border rounded-lg relative items-end">
                 <div className="md:col-span-4 space-y-1">
                  <Label htmlFor={`item-orcamento-${med.id}`}>Medicamento</Label>
                  <Input id={`item-orcamento-${med.id}`} placeholder="Ex: Paracetamol 750mg" value={med.nome} onChange={e => handleMedicamentoChange(med.id, 'nome', e.target.value)} className={cn(errors[`med_nome_${med.id}`] && 'border-destructive')} autoComplete="off" />
                </div>
                 <div className="md:col-span-3 space-y-1">
                  <Label htmlFor={`componente-ativo-${med.id}`}>Princípio Ativo</Label>
                  <Input id={`componente-ativo-${med.id}`} placeholder="Opcional" value={med.principioAtivo} onChange={e => handleMedicamentoChange(med.id, 'principioAtivo', e.target.value)} autoComplete="off" />
                </div>
                 <div className="md:col-span-1 space-y-1">
                  <Label htmlFor={`qtd-mes-${med.id}`}>Qtd. Mês</Label>
                  <Input id={`qtd-mes-${med.id}`} type="number" min="1" value={med.quantidadeMensal} onChange={e => handleMedicamentoChange(med.id, 'quantidadeMensal', parseInt(e.target.value) || 1)} autoComplete="off" />
                </div>
                 <div className="md:col-span-1 space-y-1">
                  <Label htmlFor={`qtd-trat-${med.id}`}>Qtd. Trat.</Label>
                  <Input id={`qtd-trat-${med.id}`} type="number" min="1" value={med.quantidadeTratamento} onChange={e => handleMedicamentoChange(med.id, 'quantidadeTratamento', parseInt(e.target.value) || 1)} autoComplete="off" />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor={`valor-item-${med.id}`}>Valor Unit.</Label>
                    <Input
                      id={`valor-item-${med.id}`}
                      type="text"
                      placeholder="0,00"
                      value={med.valorUnitario > 0 ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(med.valorUnitario) : ''}
                      onChange={(e) => handleValorChange(med.id, e.target.value)}
                      className={cn(errors[`med_valor_${med.id}`] && 'border-destructive', 'text-right')}
                      autoComplete="off"
                    />
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMedicamento(med.id)} className="text-destructive hover:bg-destructive/10 h-10 w-10" disabled={medicamentos.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                {(errors[`med_nome_${med.id}`] || errors[`med_valor_${med.id}`]) && (
                  <div className="md:col-span-12 space-y-1">
                    {errors[`med_nome_${med.id}`] && <p className="text-xs text-destructive">{errors[`med_nome_${med.id}`]}</p>}
                    {errors[`med_valor_${med.id}`] && <p className="text-xs text-destructive">{errors[`med_valor_${med.id}`]}</p>}
                  </div>
                )}
              </div>
            ))}
             {errors.medicamentos && <p className="text-sm text-destructive">{errors.medicamentos}</p>}
            <Button variant="secondary" onClick={handleAddMedicamento}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Medicamento
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                 <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEditing ? 'Salvar Alterações' : 'Salvar Orçamento'}
                </Button>
                
                <Button variant="ghost" onClick={onCancel} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                
                {!isEditing && (
                  <Button variant="ghost" onClick={handleClear} className="text-muted-foreground">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Limpar Formulário
                  </Button>
                )}
            </CardContent>
        </Card>
    </form>
  );
}
