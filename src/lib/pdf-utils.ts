import { PDF_CONFIG } from '@/config/pdf-config';

/**

Formata valor monetário para BRL */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}
/**

Formata CPF */
export function formatarCPF(cpf: string | null | undefined): string {
  if (!cpf) return '';
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
/**

Determina unidade pelo nome do medicamento */
export function determinarUnidadePeloNome(nomeMedicamento: string): string {
  if (!nomeMedicamento) return 'unidade';
  const nomeLower = nomeMedicamento.toLowerCase();

  // Palavras-chave para "caixa"
  if (nomeLower.includes(' drg')) {
    return 'caixa';
  }

  // Palavras-chave para "frasco"
  if (nomeLower.includes(' xarope')) {
    return 'frasco';
  }

  return 'unidade';
}

/**

Gera nome do arquivo */
export function gerarNomeArquivo(
  formato: string,
  nome: string,
  data: Date
): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const nomeCurto = nome.substring(0, 40);
  return formato
    .replace('{{NOME}}', nomeCurto)
    .replace('{{DD}}', dia)
    .replace('{{MM}}', mes);
}
/**

Formata data em português */
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(data);
}

    