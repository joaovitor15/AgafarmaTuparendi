'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import type { Orcamento } from '@/types/orcamento';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveOrcamento = (orcamentoData: Omit<Orcamento, 'id'>) => {
    const orcamentoComId = { ...orcamentoData, id: uuidv4() };
    
    // Em uma implementação real, isso salvaria no Firebase
    console.log('Salvando novo orçamento:', orcamentoComId);

    // Simula a lógica de salvamento e redirecionamento
    toast({
      title: 'Orçamento Criado!',
      description: 'O novo orçamento foi salvo com sucesso.',
    });
    
    // Redireciona para o dashboard após salvar
    router.push('/dashboard/orcamento-judicial');
  };


  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orcamento-judicial" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Novo Orçamento Judicial</h1>
      </div>
      
      <OrcamentoForm 
        onSave={handleSaveOrcamento} 
      />
    </div>
  );
}
