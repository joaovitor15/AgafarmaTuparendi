'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import type { Orcamento, Medicamento } from '@/types/orcamento';

export default function OrcamentoJudicialPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const { toast } = useToast();

  const handleSaveOrcamento = (orcamentoData: Orcamento) => {
    // Em uma implementação real, isso salvaria no Firebase/banco de dados
    console.log('Salvando orçamento:', orcamentoData);
    
    // Adiciona um ID único se ainda não tiver um
    const orcamentoComId = { ...orcamentoData, id: orcamentoData.id || uuidv4() };

    setOrcamentos(prevOrcamentos => [...prevOrcamentos, orcamentoComId]);

    toast({
      title: 'Orçamento Salvo!',
      description: 'O orçamento foi salvo com sucesso.',
    });
  };
  
  // Por enquanto, a tabela de orçamentos salvos e a geração de PDF não serão implementadas.
  // Apenas o formulário de criação.

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Gerador de Orçamento Judicial</h1>
      <OrcamentoForm onSave={handleSaveOrcamento} />
    </div>
  );
}
