'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalculosDisplayProps {
  totalMensal: number;
  totalTratamento: number;
}

export function CalculosDisplay({ totalMensal, totalTratamento }: CalculosDisplayProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Cálculo do Orçamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">Valor Total Mensal:</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(totalMensal)}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">Valor Total Tratamento:</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(totalTratamento)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
