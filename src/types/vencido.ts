export interface VencidoItem {
  id: string;
  medicamento: string;
  laboratorio: string;
  quantidade: number;
  lote: string;
  codigoBarras: string;
  msRegistro: string;
  ncm: string;
  cest: string;
  cfop: string;
  precoUnitario: number;
  dataCriacao: string;
  dataUltimaEdicao: string;
}

export interface DestinatarioVencidos {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  cep: string;
}
