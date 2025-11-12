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
  id?: string; // Opcional até ser salvo
  paciente: Paciente;
  medicamentos: Medicamento[];
}
