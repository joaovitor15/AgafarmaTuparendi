'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePDF } from '@/hooks/usePDF';
import messages from '@/locales/messages.pt-br.json';
import type { OrcamentoData } from '@/types';
import { FileDown, Loader2 } from 'lucide-react';

const mockOrcamento: OrcamentoData = {
  id: 'ORC-001',
  numero: '2024-123',
  cliente: 'João da Silva',
  processo: '001/1.23.0004567-8',
  valor: 157.85,
  dataVencimento: '2024-12-31',
  descricao: 'Fornecimento de medicamentos conforme ordem judicial.',
};

export default function OrcamentoJudicialPage() {
  const { generateOrcamento, loading } = usePDF();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{messages.pages.orcamento.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Orçamento Exemplo</CardTitle>
          <CardDescription>Estes são os dados que serão usados para gerar o PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-muted-foreground">Número:</strong> {mockOrcamento.numero}</div>
            <div><strong className="text-muted-foreground">Cliente:</strong> {mockOrcamento.cliente}</div>
            <div><strong className="text-muted-foreground">Processo:</strong> {mockOrcamento.processo}</div>
            <div><strong className="text-muted-foreground">Valor:</strong> R$ {mockOrcamento.valor.toFixed(2)}</div>
            <div><strong className="text-muted-foreground">Vencimento:</strong> {mockOrcamento.dataVencimento}</div>
          </div>
          <p><strong className="text-muted-foreground">Descrição:</strong> {mockOrcamento.descricao}</p>
          <Button onClick={() => generateOrcamento(mockOrcamento)} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            {messages.pages.orcamento.generatePdf}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
