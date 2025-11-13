'use client';

export interface OrcamentoData {
  id: string;
  numero: string;
  cliente: string;
  processo: string;
  valor: number;
  dataVencimento: string;
  descricao: string;
}

export interface VencidoData {
  id: string;
  numero: string;
  cliente: string;
  dataVencimento: string;
  diasVencido: number;
  valor: number;
}

export type StatusDevolucao =
  | 'solicitacao_nfd'
  | 'aguardar_coleta'
  | 'aguardando_credito'
  | 'devolucao_finalizada';


export interface Devolucao {
  id: string;
  notaFiscal: string;
  dataRealizada: string;
  distribuidora: string;
  produto: string;
  quantidade: number;
  motivo: string;
  protocolo?: string;
  notaFiscalEntrada: string;
  nfdNumero?: string;
  nfdValor?: number;
  dataColeta?: string;
  status: StatusDevolucao;
}
