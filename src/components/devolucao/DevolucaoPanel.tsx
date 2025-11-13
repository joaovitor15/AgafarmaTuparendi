'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Devolucao, StatusDevolucao } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DevolucaoFiltroDropdown } from './DevolucaoFiltroDropdown';
import { DevolucaoLista } from './DevolucaoLista';
import { DevolucaoModal } from './DevolucaoModal';


// MOCK_DEVOLUCOES com mais variedade de status para teste
const MOCK_DEVOLUCOES: Devolucao[] = [
  {
    id: '1',
    notaFiscal: '123456',
    dataRealizada: '2023-10-26',
    distribuidora: 'Santa Cruz',
    produtos: [{ nome: 'Paracetamol 750mg', quantidade: 50 }],
    motivo: 'Vencimento próximo',
    notaFiscalEntrada: 'NF-E 98765',
    status: 'solicitacao_nfd',
  },
  {
    id: '2',
    notaFiscal: '123457',
    dataRealizada: '2023-10-28',
    distribuidora: 'Panarello',
    produtos: [{ nome: 'Dipirona 500mg', quantidade: 30 }],
    motivo: 'Excesso de estoque',
    notaFiscalEntrada: 'NF-E 98766',
    status: 'aguardar_coleta',
    nfdNumero: 'NFD-555',
    nfdValor: 150.75,
  },
  {
    id: '3',
    notaFiscal: '654321',
    dataRealizada: '2023-11-01',
    distribuidora: 'Panarello',
    produtos: [{ nome: 'Ibuprofeno 400mg', quantidade: 20 }],
    motivo: 'Produto avariado',
    notaFiscalEntrada: 'NF-E 11223',
    status: 'aguardando_credito',
    nfdNumero: 'NFD-777',
    nfdValor: 90.0,
    dataColeta: '2023-11-05',
  },
  {
    id: '4',
    notaFiscal: '789012',
    dataRealizada: '2023-09-15',
    distribuidora: 'Gam',
    produtos: [{ nome: 'Vitamina C', quantidade: 100 }],
    motivo: 'Vencido',
    notaFiscalEntrada: 'NF-E 44556',
    status: 'devolucao_finalizada',
    nfdNumero: 'NFD-888',
    nfdValor: 250.0,
    dataColeta: '2023-09-20',
  },
    {
    id: '5',
    notaFiscal: '101010',
    dataRealizada: '2024-01-10',
    distribuidora: 'Santa Cruz',
    produtos: [{ nome: 'Losartana 50mg', quantidade: 10 }],
    motivo: 'Pedido errado',
    notaFiscalEntrada: 'NF-E 77788',
    status: 'solicitacao_nfd',
  },
];

export function DevolucaoPanel() {
  const [devolucoes, setDevolucoes] = useState<Devolucao[]>(MOCK_DEVOLUCOES);
  const [filtros, setFiltros] = useState<StatusDevolucao[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaDevolucaoId, setNovaDevolucaoId] = useState<string | null>(null);

  const devolucoesFiltradas = useMemo(() => {
    const devolucoesOrdenadas = [...devolucoes].sort((a, b) => new Date(b.dataRealizada).getTime() - new Date(a.dataRealizada).getTime());
    if (filtros.length === 0) {
      return devolucoesOrdenadas;
    }
    return devolucoesOrdenadas.filter((d) => filtros.includes(d.status));
  }, [devolucoes, filtros]);


  const handleSalvarDevolucao = (dadosDevolucao: Omit<Devolucao, 'id'>) => {
    const novoId = uuidv4();
    const novaDevolucao: Devolucao = {
      id: novoId,
      ...dadosDevolucao,
      notaFiscal: dadosDevolucao.notaFiscalEntrada, // Usando NF de entrada como agrupador inicial
    };

    setDevolucoes(prev => [novaDevolucao, ...prev]);
    setNovaDevolucaoId(novoId); // Marcar este ID para expandir
    setModalAberto(false);
  };
  
  useEffect(() => {
    // Para limpar o ID da nova devolução após a renderização ter ocorrido
    if (novaDevolucaoId) {
        const timer = setTimeout(() => setNovaDevolucaoId(null), 100);
        return () => clearTimeout(timer);
    }
  }, [novaDevolucaoId]);

  const handleUpdateDevolucao = (devolucaoAtualizada: Devolucao) => {
    setDevolucoes(prev => prev.map(d => d.id === devolucaoAtualizada.id ? devolucaoAtualizada : d));
  };


  const handleExcluirDevolucao = (id: string) => {
     setDevolucoes(devolucoes.filter((d) => d.id !== id));
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Devoluções</h1>
          <div className="flex items-center gap-2">
            <DevolucaoFiltroDropdown
              filtrosAtuais={filtros}
              onFiltroChange={setFiltros}
            />
            <Button onClick={() => setModalAberto(true)} className='w-full sm:w-auto'>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Devolução
            </Button>
          </div>
        </div>
      
      <DevolucaoLista
        devolucoes={devolucoesFiltradas}
        onUpdate={handleUpdateDevolucao}
        onExcluir={handleExcluirDevolucao}
        idParaExpandir={novaDevolucaoId}
      />

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
