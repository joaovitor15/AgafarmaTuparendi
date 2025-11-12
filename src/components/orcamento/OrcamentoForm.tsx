'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, FileDown, RotateCcw, Loader2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Orcamento, Medicamento } from '@/types/orcamento';
import { cn } from '@/lib/utils';

interface OrcamentoFormProps {
  onSave: (orcamento: Orcamento) => void;
  initialData?: Orcamento;
  onCancelEdit?: () => void;
}

const initialMedicamento: Omit<Medicamento, 'id'> = {
  nome: '',
  principioAtivo: '',
  quantidadeMensal: 1,
  quantidadeTratamento: 1,
  valorUnitario: 0,
};

export function OrcamentoForm({ onSave, initialData, onCancelEdit }: OrcamentoFormProps) {
  const [paciente, setPaciente] = useState(initialData?.paciente || { identificador: '', cpf: '' });
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(
    initialData?.medicamentos && initialData.medicamentos.length > 0
      ? initialData.medicamentos
      : [{ id: uuidv4(), ...initialMedicamento }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!paciente.identificador.trim()) {
      newErrors.paciente_identificador = 'Identificador do paciente é obrigatório.';
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
  
  const handleSave = () => {
    if (!validate()) return;
    
    setIsSaving(true);
    // Simula uma chamada de API
    setTimeout(() => {
        onSave({ id: initialData?.id, paciente, medicamentos });
        setIsSaving(false);
        if (!initialData) {
          handleClear();
        }
    }, 1000);
  };

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { id: uuidv4(), ...initialMedicamento }]);
  };

  const handleRemoveMedicamento = (id: string) => {
    setMedicamentos(medicamentos.filter(med => med.id !== id));
  };
  
  const handleMedicamentoChange = (id: string, field: keyof Medicamento, value: string | number) => {
    setMedicamentos(medicamentos.map(med => med.id === id ? { ...med, [field]: value } : med));
  };

  const handlePacienteChange = (field: 'identificador' | 'cpf', value: string) => {
    setPaciente(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setPaciente({ identificador: '', cpf: '' });
    setMedicamentos([{ id: uuidv4(), ...initialMedicamento }]);
    setErrors({});
  };
  
  return (
    <form className="space-y-6" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="pacient_identifier">Identificador</Label>
              <Input
                id="pacient_identifier"
                placeholder="Nome completo ou identificador único"
                value={paciente.identificador}
                onChange={e => handlePacienteChange('identificador', e.target.value)}
                className={cn(errors.paciente_identificador && 'border-destructive')}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
               {errors.paciente_identificador && <p className="text-xs text-destructive">{errors.paciente_identificador}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="cpf_field">CPF (Opcional)</Label>
              <Input
                id="cpf_field"
                placeholder="000.000.000-00"
                value={paciente.cpf}
                onChange={e => handlePacienteChange('cpf', e.target.value)}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
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
                  <Label htmlFor={`med_nome_${med.id}`}>Medicamento</Label>
                  <Input id={`med_nome_${med.id}`} placeholder="Ex: Paracetamol 750mg" value={med.nome} onChange={e => handleMedicamentoChange(med.id, 'nome', e.target.value)} className={cn(errors[`med_nome_${med.id}`] && 'border-destructive')} autoComplete="off" data-lpignore="true" />
                </div>
                 <div className="md:col-span-3 space-y-1">
                  <Label htmlFor={`med_principio_${med.id}`}>Princípio Ativo</Label>
                  <Input id={`med_principio_${med.id}`} placeholder="Opcional" value={med.principioAtivo} onChange={e => handleMedicamentoChange(med.id, 'principioAtivo', e.target.value)} autoComplete="off" data-lpignore="true" />
                </div>
                 <div className="md:col-span-1 space-y-1">
                  <Label htmlFor={`med_qtd_mes_${med.id}`}>Qtd. Mês</Label>
                  <Input id={`med_qtd_mes_${med.id}`} type="number" min="1" value={med.quantidadeMensal} onChange={e => handleMedicamentoChange(med.id, 'quantidadeMensal', parseInt(e.target.value) || 1)} />
                </div>
                 <div className="md:col-span-1 space-y-1">
                  <Label htmlFor={`med_qtd_trat_${med.id}`}>Qtd. Trat.</Label>
                  <Input id={`med_qtd_trat_${med.id}`} type="number" min="1" value={med.quantidadeTratamento} onChange={e => handleMedicamentoChange(med.id, 'quantidadeTratamento', parseInt(e.target.value) || 1)} />
                </div>
                 <div className="md:col-span-2 space-y-1">
                  <Label htmlFor={`med_valor_${med.id}`}>Valor Unit.</Label>
                  <Input id={`med_valor_${med.id}`} type="number" step="0.01" min="0" placeholder="R$ 0,00" value={med.valorUnitario} onChange={e => handleMedicamentoChange(med.id, 'valorUnitario', parseFloat(e.target.value) || 0)} className={cn(errors[`med_valor_${med.id}`] && 'border-destructive')} />
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMedicamento(med.id)} className="text-destructive hover:bg-destructive/10 h-10 w-10">
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
                    {initialData ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
                </Button>
                <Button variant="outline" disabled={true}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Gerar PDF
                </Button>
                {onCancelEdit ? (
                   <Button variant="ghost" onClick={onCancelEdit} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                       <X className="mr-2 h-4 w-4" />
                       Cancelar Edição
                   </Button>
                ) : (
                  <Button variant="ghost" onClick={handleClear} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Limpar Formulário
                  </Button>
                )}
            </CardContent>
        </Card>
    </form>
  );
}
