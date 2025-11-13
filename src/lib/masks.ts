export const formatCpf = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
  value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca ponto após o terceiro dígito
  value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca ponto após o sexto dígito
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen antes dos dois últimos dígitos
  return value;
};
