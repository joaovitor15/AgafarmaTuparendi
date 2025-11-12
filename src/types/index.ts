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

export interface DevolucaoData {
  id: string;
  numero: string;
  cliente: string;
  dataDevolvido: string;
  motivo: string;
  observacoes: string;
}
