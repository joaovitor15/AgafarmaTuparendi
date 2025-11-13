'use client';

import type { Devolucao } from '@/types';
import { EmptyState } from '../ui/empty-state';
import { DevolucaoCard } from './DevolucaoCard';

interface DevolucaoListaProps {
  devolucoes: Devolucao[];
  onUpdate: (devolucao: Devolucao) => void;
  onExcluir: (id: string) => void;
}

export function DevolucaoLista({
  devolucoes,
  onUpdate,
  onExcluir,
}: DevolucaoListaProps) {
  
  if (devolucoes.length === 0) {
    return (
        <div className='py-12'>
            <EmptyState
                icon={<div className="text-4xl">📦</div>}
                title="Nenhuma devolução encontrada"
                description="Nenhuma devolução corresponde aos filtros selecionados. Tente limpar os filtros para ver todos os itens."
            />
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {devolucoes.map((devolucao) => (
        <DevolucaoCard
          key={devolucao.id}
          devolucao={devolucao}
          onUpdate={onUpdate}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
}
