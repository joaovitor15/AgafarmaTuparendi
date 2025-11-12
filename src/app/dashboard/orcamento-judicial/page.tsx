'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { FileDown, Pencil, Trash2, PlusCircle, Settings, Search, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrcamentoJudicialDashboardPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    const q = query(collection(db, `users/${user.uid}/orcamentoJudicial`));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orcamentosData: Orcamento[] = [];
      querySnapshot.forEach((doc) => {
        orcamentosData.push({ id: doc.id, ...doc.data() } as Orcamento);
      });
      setOrcamentos(orcamentosData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar orçamentos: ", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar os orçamentos.",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleDelete = (id: string) => {
    // Lógica de exclusão no Firebase a ser implementada
    console.log("Excluir orçamento com ID:", id);
    // setOrcamentos(orcamentos.filter(o => o.id !== id));
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
        </div>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Orçamentos</CardTitle>
            <CardDescription>Visualize e gerencie todos os orçamentos criados.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
                <TableCaption>
                  {loading && "Carregando orçamentos..."}
                  {!loading && orcamentos.length === 0 && "Nenhum orçamento criado. Crie um novo!"}
                  {!loading && orcamentos.length > 0 && "Lista de orçamentos salvos."}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Nº Medicamentos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                          <TableCell className="text-right space-x-2">
                            <Skeleton className="h-8 w-8 inline-block" />
                            <Skeleton className="h-8 w-8 inline-block" />
                            <Skeleton className="h-8 w-8 inline-block" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      orcamentos.map(orcamento => (
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
                                      <Button variant="destructive" size="icon" disabled>
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
                      ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
