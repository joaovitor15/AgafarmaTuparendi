'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Devolucao, StatusDevolucao } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { DevolucaoFiltroDropdown } from './DevolucaoFiltroDropdown';
import { DevolucaoLista } from './DevolucaoLista';
import { DevolucaoModal } from './DevolucaoModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addDevolucao, updateDevolucao, deleteDevolucao } from '@/services/devolucaoService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../ui/empty-state';

export function DevolucaoPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const devolucoesQuery = useMemo(() => {
    if (!user) return null;
    return collection(db, 'users', user.uid, 'devolucao');
  }, [user]);

  const { data: devolucoes = [], isLoading } = useCollection<Devolucao>(devolucoesQuery);

  const [filtros, setFiltros] = useState<StatusDevolucao[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [idParaExpandir, setIdParaExpandir] = useState<string | null>(null);

  const devolucoesFiltradas = useMemo(() => {
    const devolucoesOrdenadas = [...(devolucoes || [])].sort((a, b) => {
        // Finalizadas vão para o fim
        if (a.status === 'devolucao_finalizada' && b.status !== 'devolucao_finalizada') return 1;
        if (a.status !== 'devolucao_finalizada' && b.status === 'devolucao_finalizada') return -1;
        // Ordena pela data mais recente
        return new Date(b.dataRealizada).getTime() - new Date(a.dataRealizada).getTime()
    });

    if (filtros.length === 0) {
      return devolucoesOrdenadas;
    }
    return devolucoesOrdenadas.filter((d) => filtros.includes(d.status));
  }, [devolucoes, filtros]);


  const handleSalvarDevolucao = async (dadosDevolucao: Omit<Devolucao, 'id'>) => {
    if (!user) return;
    try {
        const novoId = await addDevolucao(user.uid, dadosDevolucao);
        setIdParaExpandir(novoId);
        setModalAberto(false);
        toast({ title: "Devolução criada com sucesso!" });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Erro ao criar devolução." });
    }
  };
  
  useEffect(() => {
    if (idParaExpandir) {
        const timer = setTimeout(() => setIdParaExpandir(null), 100);
        return () => clearTimeout(timer);
    }
  }, [idParaExpandir]);

  const handleUpdateDevolucao = async (devolucaoAtualizada: Devolucao) => {
    if (!user) return;
    try {
        await updateDevolucao(user.uid, devolucaoAtualizada.id, devolucaoAtualizada);
        toast({ title: "Devolução atualizada!" });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Erro ao atualizar devolução." });
    }
  };


  const handleExcluirDevolucao = async (id: string) => {
    if (!user) return;
    try {
        await deleteDevolucao(user.uid, id);
        toast({ title: "Devolução cancelada com sucesso." });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Erro ao cancelar devolução." });
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (devolucoes.length === 0) {
        return (
             <div className='py-12'>
                <EmptyState
                    icon={<div className="text-4xl">📦</div>}
                    title="Nenhuma devolução em andamento"
                    description="Crie uma nova devolução para começar a gerenciar os processos."
                    action={{
                        label: 'Criar Primeira Devolução',
                        onClick: () => setModalAberto(true),
                    }}
                />
            </div>
        )
    }

    return (
        <DevolucaoLista
            devolucoes={devolucoesFiltradas}
            onUpdate={handleUpdateDevolucao}
            onExcluir={handleExcluirDevolucao}
            idParaExpandir={idParaExpandir}
        />
    )
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Devoluções</h1>
          <div className="flex items-center gap-2">
            <DevolucaoFiltroDropdown
              filtrosAtuais={filtros}
              onFiltroChange={setFiltros}
            />
            <Button onClick={() => setModalAberto(true)} className='w-full sm:w-auto' disabled={isLoading}>
              {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Nova Devolução
            </Button>
          </div>
        </div>
      
      {renderContent()}

      {modalAberto && (
         <DevolucaoModal
            open={modalAberto}
            onOpenChange={setModalAberto}
            onSave={handleSalvarDevolucao}
          />
      )}
    </div>
  );
}
