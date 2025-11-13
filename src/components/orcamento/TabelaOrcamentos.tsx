'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, query, deleteDoc, doc, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { formatarCPF } from '@/lib/formatters';

const MedicamentosModal = dynamic(
  () => import('@/components/orcamento/MedicamentosModal').then(mod => mod.MedicamentosModal),
  { 
    loading: () => <div className="p-4 text-center">Carregando...</div>,
    ssr: false
  }
);

const PAGE_SIZE = 10;

export function TabelaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [clientRendered, setClientRendered] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const loadOrcamentos = useCallback(async (initial = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (initial) {
      setLoading(true);
      setOrcamentos([]);
      setLastDoc(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let q;
      const orcamentoCollection = collection(db, `users/${user.uid}/orcamentoJudicial`);

      if (lastDoc && !initial) {
        q = query(orcamentoCollection, orderBy('dataCriacao', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      } else {
        q = query(orcamentoCollection, orderBy('dataCriacao', 'desc'), limit(PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const newDocs = snapshot.docs;
      
      const newOrcamentos = newDocs.map(doc => ({ id: doc.id, ...doc.data() } as Orcamento));

      if (initial) {
        setOrcamentos(newOrcamentos);
      } else {
        setOrcamentos(prev => [...prev, ...newOrcamentos]);
      }
      
      if (newDocs.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (newDocs.length > 0) {
        setLastDoc(newDocs[newDocs.length - 1]);
      }

    } catch (err) {
      console.error("Erro ao buscar orçamentos: ", err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar os orçamentos.",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, lastDoc, toast]);


  useEffect(() => {
    setClientRendered(true);
    loadOrcamentos(true);
  }, [user]); // Re-executa apenas se o usuário mudar. A função `loadOrcamentos` é chamada manualmente.

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/orcamentoJudicial`, id));
      setOrcamentos(prev => prev.filter(o => o.id !== id));
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
        <div className="border rounded-lg overflow-hidden">
          <Table>
              <TableCaption>
                {!loading && orcamentos.length === 0 && "Nenhum orçamento criado."}
                {loading && orcamentos.length === 0 && "Carregando orçamentos..."}
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
                  {loading && orcamentos.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
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
                              {clientRendered && new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR', {
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
                                {orcamento.medicamentos.length} {orcamento.medicamentos.length === 1 ? 'item' : 'itens'}
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
        {hasMore && !loading && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => loadOrcamentos()} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Carregar mais
            </Button>
          </div>
        )}
        {selectedOrcamento && (
          <Suspense fallback={<div>Carregando modal...</div>}>
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
          </Suspense>
        )}
      </>
  );
}