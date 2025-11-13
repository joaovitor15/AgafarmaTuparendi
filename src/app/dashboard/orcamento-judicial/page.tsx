'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { FileDown, Pencil, Trash2, PlusCircle, Loader2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { formatarCPF } from '@/lib/formatters';
import { MedicamentosModal } from '@/components/orcamento/MedicamentosModal';

export default function OrcamentoJudicialDashboardPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

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
      setOrcamentos(orcamentosData.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
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

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/orcamentoJudicial`, id));
      toast({
        title: 'Orçamento Excluído!',
        description: 'O orçamento foi removido com sucesso.',
      });
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Excluir',
        description: 'Não foi possível remover o orçamento.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/orcamento-judicial/${id}`);
  };

  return (
    <>
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
              <CardDescription>Visualize, edite ou remova os orçamentos criados.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableCaption>
                      {loading && "Carregando orçamentos..."}
                      {!loading && orcamentos.length === 0 && "Nenhum orçamento criado."}
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[25%]">Paciente</TableHead>
                            <TableHead className="w-[20%]">CPF</TableHead>
                            <TableHead className="w-[20%]">Data Criação</TableHead>
                            <TableHead className="w-[15%]">Medicamentos</TableHead>
                            <TableHead className="text-right w-[20%]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                              <TableCell className="text-right space-x-2">
                                <Skeleton className="h-10 w-10 inline-block rounded-full" />
                                <Skeleton className="h-10 w-10 inline-block rounded-full" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          orcamentos.map(orcamento => (
                              <TableRow key={orcamento.id}>
                                  <TableCell className="font-medium">{orcamento.paciente.identificador}</TableCell>
                                  <TableCell>{formatarCPF(orcamento.paciente.cpf)}</TableCell>
                                  <TableCell>
                                    {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      onClick={() => setSelectedOrcamento(orcamento)}
                                      className="inline-flex items-center justify-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
                                    >
                                      {orcamento.medicamentos.length} {orcamento.medicamentos.length > 1 ? 'itens' : 'item'}
                                    </button>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleEdit(orcamento.id)}>
                                          <Pencil className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="icon" className="rounded-full" disabled={deletingId === orcamento.id}>
                                              {deletingId === orcamento.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
                                    </div>
                                  </TableCell>
                              </TableRow>
                          ))
                        )}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
        </Card>
      </div>
      {selectedOrcamento && (
        <MedicamentosModal
          open={!!selectedOrcamento}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedOrcamento(null);
            }
          }}
          medicamentos={selectedOrcamento.medicamentos}
          pacienteName={selectedOrcamento.paciente.identificador}
        />
      )}
    </>
  );
}
