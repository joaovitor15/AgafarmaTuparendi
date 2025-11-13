'use client';

import { useState, useMemo } from 'react';
import { DevolucaoFiltro } from './DevolucaoFiltro';
import { DevolucaoLista } from './DevolucaoLista';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Devolucao, StatusDevolucao } from '@/types';
import { DevolucaoModal } from './DevolucaoModal';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const MOCK_DEVOLUCOES: Devolucao[] = [
  {
    id: '1',
    notaFiscal: '123456',
    dataRealizada: '2023-10-26',
    distribuidora: 'Santa Cruz',
    produto: 'Paracetamol 750mg',
    quantidade: 50,
    motivo: 'Vencimento próximo',
    notaFiscalEntrada: 'NF-E 98765',
    status: 'solicitacao_nfd',
  },
  {
    id: '2',
    notaFiscal: '123456',
    dataRealizada: '2023-10-26',
    distribuidora: 'Santa Cruz',
    produto: 'Dipirona 500mg',
    quantidade: 30,
    motivo: 'Excesso de estoque',
    notaFiscalEntrada: 'NF-E 98765',
    status: 'aguardar_coleta',
    nfdNumero: 'NFD-555',
    nfdValor: 150.75,
  },
  {
    id: '3',
    notaFiscal: '654321',
    dataRealizada: '2023-11-01',
    distribuidora: 'Panarello',
    produto: 'Ibuprofeno 400mg',
    quantidade: 20,
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
    produto: 'Vitamina C',
    quantidade: 100,
    motivo: 'Vencido',
    notaFiscalEntrada: 'NF-E 44556',
    status: 'devolucao_finalizada',
    nfdNumero: 'NFD-888',
    nfdValor: 250.0,
    dataColeta: '2023-09-20',
  },
];

export function DevolucaoPanel() {
  const [devolucoes, setDevolucoes] = useState<Devolucao[]>(MOCK_DEVOLUCOES);
  const [filtroStatus, setFiltroStatus] = useState<StatusDevolucao[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [devolucaoEmEdicao, setDevolucaoEmEdicao] = useState<Devolucao | null>(null);

  const devolucoesFiltradas = useMemo(() => {
    if (filtroStatus.length === 0) {
      return devolucoes;
    }
    return devolucoes.filter((d) => filtroStatus.includes(d.status));
  }, [devolucoes, filtroStatus]);

  const devolucoesAgrupadas = useMemo(() => {
    return devolucoesFiltradas.reduce((acc, dev) => {
      (acc[dev.notaFiscal] = acc[dev.notaFiscal] || []).push(dev);
      return acc;
    }, {} as Record<string, Devolucao[]>);
  }, [devolucoesFiltradas]);

  const handleAbrirModal = (devolucao?: Devolucao | null) => {
    setDevolucaoEmEdicao(devolucao || null);
    setModalAberto(true);
  };
  
  const handleSalvarDevolucao = (devolucao: Devolucao) => {
    if (devolucao.id) {
      // Editar
      setDevolucoes(devolucoes.map((d) => (d.id === devolucao.id ? devolucao : d)));
    } else {
      // Criar
      setDevolucoes([...devolucoes, { ...devolucao, id: uuidv4() }]);
    }
    setModalAberto(false);
  };

  const handleExcluirDevolucao = (id: string) => {
     setDevolucoes(devolucoes.filter((d) => d.id !== id));
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Devoluções</h1>
          <Button onClick={() => handleAbrirModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Devolução
          </Button>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtro por Status</CardTitle>
          <CardDescription>Selecione um ou mais status para filtrar a lista de devoluções.</CardDescription>
        </CardHeader>
        <CardContent>
          <DevolucaoFiltro
            filtroStatus={filtroStatus}
            onFiltroChange={setFiltroStatus}
          />
        </CardContent>
      </Card>
      
      <DevolucaoLista
        devolucoesAgrupadas={devolucoesAgrupadas}
        onEditar={handleAbrirModal}
        onExcluir={handleExcluirDevolucao}
      />

      {modalAberto && (
         <DevolucaoModal
            open={modalAberto}
            onOpenChange={setModalAberto}
            devolucao={devolucaoEmEdicao}
            onSave={handleSalvarDevolucao}
          />
      )}
    </div>
  );
}
