'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePDF } from '@/hooks/usePDF';
import messages from '@/locales/messages.pt-br.json';
import type { VencidoData } from '@/types';
import { FileDown, Loader2 } from 'lucide-react';

const mockVencidos: VencidoData[] = [
  { id: 'VEN-001', numero: '2024-088', cliente: 'Maria Oliveira', dataVencimento: '2024-05-10', diasVencido: 45, valor: 234.50 },
  { id: 'VEN-002', numero: '2024-091', cliente: 'Carlos Pereira', dataVencimento: '2024-06-01', diasVencido: 23, valor: 88.99 },
];

export default function VencidosPage() {
  const { generateVencidos, loading } = usePDF();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">{messages.pages.vencidos.title}</h1>
        <Button onClick={() => generateVencidos(mockVencidos)} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
          {messages.pages.vencidos.generatePdf}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Processos Vencidos</CardTitle>
          <CardDescription>Esta é a lista de processos que será incluída no relatório PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Venc.</TableHead>
                <TableHead className="text-right">Dias Vencido</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVencidos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.numero}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.dataVencimento}</TableCell>
                  <TableCell className="text-right text-destructive font-bold">{item.diasVencido}</TableCell>
                  <TableCell className="text-right">R$ {item.valor.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
