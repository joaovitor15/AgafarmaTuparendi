export interface Medicamento {
  id: string;
  nome: string;
  principioAtivo?: string;
  quantidadeMensal: number;
  quantidadeTratamento: number;
  valorUnitario: number;
}

export interface Paciente {
  identificador: string;
  cpf?: string;
}

export interface Orcamento {
  id: string;
  usuarioId: string;
  paciente: Paciente;
  medicamentos: Medicamento[];
  status: 'ativo' | 'arquivado';
  dataCriacao: string;
  dataUltimaEdicao: string;
}
