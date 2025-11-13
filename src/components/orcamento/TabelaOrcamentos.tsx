'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { Pencil, Trash2, Loader2, ChevronDown, Copy, FileText } from 'lucide-react';
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
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { formatarCPF } from '@/lib/formatters';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MedicamentosAdaptive } from './MedicamentosAdaptive';
import { ReutilizarModal } from './ReutilizarModal';
import { addOrcamento } from '@/services/orcamentoService';
import { useGerarPDFOrcamento } from '@/hooks/use-gerar-pdf-orcamento';
import { OrcamentoPDFTemplate } from '@/components/pdf/orcamento-pdf-template';


const TabelaOrcamentosSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="w-[25%]"><Skeleton className="h-4 w-2/3" /></TableHead>
          <TableHead className="w-[20%]"><Skeleton className="h-4 w-1/2" /></TableHead>
          <TableHead className="w-[20%]"><Skeleton className="h-4 w-1/2" /></TableHead>
          <TableHead className="w-[15%]"><Skeleton className="h-4 w-1/3" /></TableHead>
          <TableHead className="text-right w-[20%]"><Skeleton className="h-4 w-1/4 ml-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
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

const PAGE_SIZE = 10;

export function TabelaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clientRendered, setClientRendered] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [selectedOrcamentoParaPDF, setSelectedOrcamentoParaPDF] = useState<Orcamento | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { gerarPDF, loading: loadingPDF } = useGerarPDFOrcamento();

  const fetchOrcamentos = useCallback(async (initial = false) => {
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

      setOrcamentos(prev => initial ? newOrcamentos : [...prev, ...newOrcamentos]);
      
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
    if(user) {
      fetchOrcamentos(true);
    }
  }, [user]);

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

  const handleGerarPDF = (orcamento: Orcamento) => {
    setSelectedOrcamentoParaPDF(orcamento);

    setTimeout(() => {
      gerarPDF(orcamento).finally(() => {
        setSelectedOrcamentoParaPDF(null);
      });
    }, 100);
  };

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, []);

  const handleDuplicar = async (orcamento: Orcamento) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Você precisa estar logado para realizar esta ação.'});
      return;
    }
    
    setLoading(true);
    try {
        const { id, usuarioId, ...dadosAntigos } = orcamento;

        const novoOrcamento = {
          ...dadosAntigos,
          dataCriacao: new Date().toISOString(),
          dataUltimaEdicao: new Date().toISOString(),
          status: 'ativo' as const,
        }

        await addOrcamento(user.uid, novoOrcamento as any);
        await deleteDoc(doc(db, `users/${user.uid}/orcamentoJudicial`, id));
        
        toast({ title: 'Orçamento duplicado com sucesso!' });
        await fetchOrcamentos(true);
    } catch (err) {
        toast({ variant: 'destructive', title: 'Erro ao duplicar orçamento' });
        console.error(err);
    } finally {
        setLoading(false);
        setSelectedOrcamento(null);
    }
  };


  if (loading && orcamentos.length === 0) {
    return <TabelaOrcamentosSkeleton />;
  }
  
  if (orcamentos.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhum orçamento criado ainda.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/orcamento-judicial/novo')}>
                Criar Primeiro Orçamento
            </Button>
        </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {orcamentos.map((orc) => (
          <div key={orc.id} className="bg-card border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => setExpandedId(expandedId === orc.id ? null : orc.id)}
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{orc.paciente.identificador}</p>
                <p className="text-xs text-muted-foreground">
                  {clientRendered && new Date(orc.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedId === orc.id ? 'rotate-180' : ''}`} />
            </div>

            {expandedId === orc.id && (
              <div className="border-t bg-muted/30 p-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">CPF</p>
                  <p className="text-sm font-medium">{formatarCPF(orc.paciente.cpf)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Medicamentos ({orc.medicamentos.length})</p>
                  <div className="space-y-2">
                    {orc.medicamentos.map((med) => (
                      <div key={med.id || med.nome} className="bg-background p-2 rounded text-xs border">
                        <div className="flex justify-between">
                          <p className="font-medium flex-1 pr-2">{med.nome}</p>
                          <p className="font-semibold text-primary">{formatCurrency.format(med.valorUnitario)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                   <Button size="sm" className="flex-1 rounded-full h-10" variant="outline" onClick={() => handleGerarPDF(orc)} disabled={loadingPDF}>
                     {loadingPDF ? <Loader2 className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4 mr-2" />} PDF
                  </Button>
                   <Button size="sm" className="flex-1 rounded-full h-10" variant="outline" onClick={() => handleEdit(orc.id)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                   <Button size="sm" className="flex-1 rounded-full h-10" variant="outline" onClick={() => setSelectedOrcamento(orc)}>
                    <Copy className="h-4 w-4 mr-2" /> Reutilizar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button size="sm" variant="destructive" className="flex-1 rounded-full h-10" disabled={deletingId === orc.id}>
                        {deletingId === orc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        Deletar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(orc.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        ))}
         {hasMore && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => fetchOrcamentos()} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Carregar mais
            </Button>
          </div>
        )}
         {selectedOrcamento && (
          <ReutilizarModal
            open={!!selectedOrcamento}
            onOpenChange={() => setSelectedOrcamento(null)}
            orcamento={selectedOrcamento}
            onDuplicar={handleDuplicar}
            loading={loading}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {selectedOrcamentoParaPDF && (
        <div style={{ position: 'fixed', left: '-2000px', top: 0, zIndex: -1 }}>
            <OrcamentoPDFTemplate orcamento={selectedOrcamentoParaPDF} />
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>
            {!loading && orcamentos.length === 0 && "Nenhum orçamento criado."}
            {loading && orcamentos.length === 0 && "Carregando orçamentos..."}
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[30%]">Paciente</TableHead>
              <TableHead className="w-[15%]">CPF</TableHead>
              <TableHead className="w-[15%]">Data Criação</TableHead>
              <TableHead className="w-[15%]">Medicamentos</TableHead>
              <TableHead className="text-right w-[25%]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamentos.map(orcamento => (
              <TableRow key={orcamento.id}>
                <TableCell className="font-medium">{orcamento.paciente.identificador}</TableCell>
                <TableCell>{formatarCPF(orcamento.paciente.cpf)}</TableCell>
                <TableCell>
                  {clientRendered && new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <MedicamentosAdaptive
                    pacienteName={orcamento.paciente.identificador}
                    medicamentos={orcamento.medicamentos}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleGerarPDF(orcamento)} disabled={loadingPDF}>
                      {loadingPDF ? <Loader2 className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleEdit(orcamento.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                     <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedOrcamento(orcamento)}>
                      <Copy className="h-4 w-4" />
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
                          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(orcamento.id)}>Excluir</AlertDialogAction>
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
      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => fetchOrcamentos()} disabled={loadingMore}>
            {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Carregar mais
          </Button>
        </div>
      )}
       {selectedOrcamento && (
        <ReutilizarModal
          open={!!selectedOrcamento}
          onOpenChange={() => setSelectedOrcamento(null)}
          orcamento={selectedOrcamento}
          onDuplicar={handleDuplicar}
          loading={loading}
        />
      )}
    </>
  );
}

    