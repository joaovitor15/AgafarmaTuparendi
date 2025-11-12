'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePDF } from '@/hooks/usePDF';
import messages from '@/locales/messages.pt-br.json';
import type { DevolucaoData } from '@/types';
import { FileDown, Loader2 } from 'lucide-react';

const mockDevolucao: DevolucaoData = {
  id: 'DEV-001',
  numero: '2024-105',
  cliente: 'Ana Costa',
  dataDevolvido: '2024-07-15',
  motivo: 'Produto danificado',
  observacoes: 'A caixa do medicamento estava amassada e o lacre rompido. Cliente solicitou a troca imediata.',
};

export default function DevolucaoPage() {
  const { generateDevolucao, loading } = usePDF();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{messages.pages.devolucao.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Devolução Exemplo</CardTitle>
          <CardDescription>Estes são os dados que serão usados para gerar o PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-muted-foreground">Número:</strong> {mockDevolucao.numero}</div>
            <div><strong className="text-muted-foreground">Cliente:</strong> {mockDevolucao.cliente}</div>
            <div><strong className="text-muted-foreground">Data da Devolução:</strong> {mockDevolucao.dataDevolvido}</div>
            <div><strong className="text-muted-foreground">Motivo:</strong> {mockDevolucao.motivo}</div>
          </div>
          <p><strong className="text-muted-foreground">Observações:</strong> {mockDevolucao.observacoes}</p>
          <Button onClick={() => generateDevolucao(mockDevolucao)} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            {messages.pages.devolucao.generatePdf}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
