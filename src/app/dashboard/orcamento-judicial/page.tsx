'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { FileDown, Pencil, Trash2, PlusCircle, Settings, Search } from 'lucide-react';
import type { Orcamento } from '@/types/orcamento';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

export default function OrcamentoJudicialDashboardPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const { toast } = useToast(); // Fictício, pois useToast não está no escopo, mas representando a ideia.

  const handleDelete = (id: string) => {
    setOrcamentos(orcamentos.filter(o => o.id !== id));
    // toast({
    //   variant: 'destructive',
    //   title: 'Orçamento Excluído!',
    //   description: 'O orçamento foi removido da lista.',
    // });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orçamentos Judiciais</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/orcamento-judicial/novo">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TODO: Filtros e KPIs */}

      <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Orçamentos</CardTitle>
            <CardDescription>Visualize e gerencie todos os orçamentos criados.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
                <TableCaption>{orcamentos.length === 0 ? "Nenhum orçamento criado. Crie um novo!" : "Lista de orçamentos salvos."}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Nº Medicamentos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orcamentos.map(orcamento => (
                        <TableRow key={orcamento.id}>
                            <TableCell className="font-medium">{orcamento.paciente.identificador}</TableCell>
                            <TableCell>{orcamento.paciente.cpf || 'N/A'}</TableCell>
                            <TableCell>{orcamento.medicamentos.length}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="icon" disabled>
                                    <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" disabled>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o orçamento de
                                        "{orcamento.paciente.identificador}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(orcamento.id!)}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}

// Mock useToast para evitar erros de compilação.
const useToast = () => ({
  toast: (options: any) => console.log('Toast:', options),
});
