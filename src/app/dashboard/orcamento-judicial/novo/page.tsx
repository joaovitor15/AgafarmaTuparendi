'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import type { Orcamento } from '@/types/orcamento';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { addOrcamento } from '@/services/orcamentoService';

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveOrcamento = async (orcamentoData: Omit<Orcamento, 'id'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Você precisa estar logado para salvar um orçamento.',
      });
      return;
    }

    const orcamentoComId: Orcamento = { 
      ...orcamentoData, 
      id: uuidv4(),
      usuarioId: user.uid,
      dataCriacao: new Date().toISOString(),
      dataUltimaEdicao: new Date().toISOString(),
      status: 'ativo',
    };

    try {
      await addOrcamento(user.uid, orcamentoComId);
      toast({
        title: 'Orçamento Criado!',
        description: 'O novo orçamento foi salvo com sucesso.',
      });
      router.push('/dashboard/orcamento-judicial');
    } catch (error) {
      console.error("Erro ao salvar orçamento: ", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar o orçamento. Tente novamente.',
      });
    }
  };


  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orcamento-judicial" passHref>
          <Button variant="secondary" size="icon" className='rounded-full'>
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
