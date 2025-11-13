'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2, Pencil, Trash2, FileText, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
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
import { formatarCPF } from '@/lib/formatters';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { VencidoItem } from '@/types/vencido';

const TabelaVencidosSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="w-[25%]"><Skeleton className="h-4 w-2/3" /></TableHead>
          <TableHead><Skeleton className="h-4 w-1/2" /></TableHead>
          <TableHead><Skeleton className="h-4 w-1/2" /></TableHead>
          <TableHead><Skeleton className="h-4 w-1/3" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-4 w-1/4 ml-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
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
        ))}
      </TableBody>
    </Table>
  </div>
);

const PAGE_SIZE = 15;

export default function VencidosPage() {
  const [vencidos, setVencidos] = useState<VencidoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const fetchVencidos = useCallback(async (initial = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (initial) setLoading(true);
    else setLoadingMore(true);

    try {
      const vencidosCollection = collection(db, `users/${user.uid}/vencidos`);
      let q;

      if (lastDoc && !initial) {
        q = query(vencidosCollection, orderBy('dataCriacao', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      } else {
        q = query(vencidosCollection, orderBy('dataCriacao', 'desc'), limit(PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const newDocs = snapshot.docs;
      const newVencidos = newDocs.map(doc => ({ id: doc.id, ...doc.data() } as VencidoItem));
      
      setVencidos(prev => initial ? newVencidos : [...prev, ...newVencidos]);
      
      if (newDocs.length < PAGE_SIZE) setHasMore(false);
      if (newDocs.length > 0) setLastDoc(newDocs[newDocs.length - 1]);

    } catch (err) {
      console.error("Erro ao buscar vencidos: ", err);
      toast({ variant: "destructive", title: "Erro ao carregar dados" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, lastDoc, toast]);
  
  useEffect(() => {
    if(user) fetchVencidos(true);
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/vencidos`, id));
      setVencidos(prev => prev.filter(o => o.id !== id));
      toast({ title: 'Item Excluído!', description: 'O item vencido foi removido.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao Excluir' });
    } finally {
      setDeletingId(null);
    }
  };

  const totais = useMemo(() => {
    const totalItens = vencidos.length;
    const totalGeral = vencidos.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
    return { totalItens, totalGeral };
  }, [vencidos]);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading && vencidos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Vencidos</h1>
          <Skeleton className="h-10 w-48" />
        </div>
        <TabelaVencidosSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Vencidos</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={true}>
              <FileText className="mr-2" />
              Gerar PDF
            </Button>
            <Link href="/dashboard/vencidos/novo">
              <Button>
                <PlusCircle className="mr-2" />
                Adicionar Novo
              </Button>
            </Link>
          </div>
        </div>

      {vencidos.length === 0 ? (
         <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Nenhum medicamento vencido adicionado.</p>
            <p className="text-sm text-muted-foreground">Clique em "+ Adicionar Novo" para começar.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Medicamento</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Cód. Barras</TableHead>
                    <TableHead>Preço Unit</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vencidos.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium truncate max-w-xs">{item.medicamento}</TableCell>
                      <TableCell>{item.laboratorio}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>{item.lote}</TableCell>
                      <TableCell>{item.codigoBarras}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.precoUnitario)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(item.quantidade * item.precoUnitario)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="icon" className="rounded-full">
                            <Link href={`/dashboard/vencidos/${item.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" className="rounded-full" disabled={deletingId === item.id}>
                                {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Deleção</AlertDialogTitle>
                                <AlertDialogDescription>Tem certeza que deseja deletar este medicamento vencido?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)}>Deletar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardHeader className="flex-row justify-end items-center gap-4 text-right bg-muted/50 p-3 rounded-b-lg">
             <p className="text-sm text-muted-foreground">Total de Itens: <span className="font-bold text-foreground">{totais.totalItens}</span></p>
             <p className="text-sm text-muted-foreground">Total Geral: <span className="font-bold text-foreground">{formatCurrency(totais.totalGeral)}</span></p>
          </CardHeader>
        </Card>
      )}
       {hasMore && !loading && vencidos.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => fetchVencidos()} disabled={loadingMore}>
            {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Carregar mais"}
          </Button>
        </div>
      )}
    </div>
  );
}
