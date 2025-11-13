export const formatarCPF = (cpf: string | undefined | null): string => {
  if (!cpf) return 'N/A';

  const clean = cpf.replace(/\D/g, '');

  if (clean.length !== 11) {
    // Retorna o valor original se não for um CPF completo, para não quebrar a UI
    return cpf;
  }

  // Formata: XXX.XXX.XXX-XX
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
