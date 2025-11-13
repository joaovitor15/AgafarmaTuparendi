'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import type { Orcamento } from '@/types/orcamento';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getOrcamento, updateOrcamento } from '@/services/orcamentoService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditarOrcamentoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const [orcamento, setOrcamento] = useState<Omit<Orcamento, 'id'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orcamentoId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!user || !orcamentoId) return;

    const fetchOrcamento = async () => {
      try {
        setLoading(true);
        const data = await getOrcamento(user.uid, orcamentoId);
        if (data) {
          setOrcamento(data);
        } else {
          setError('Orçamento não encontrado ou você não tem permissão para acessá-lo.');
          toast({
            variant: 'destructive',
            title: 'Erro ao Carregar',
            description: 'Orçamento não encontrado.',
          });
          router.replace('/dashboard/orcamento-judicial');
        }
      } catch (err) {
        console.error("Erro ao buscar orçamento:", err);
        setError('Falha ao carregar os dados do orçamento. Tente novamente.');
        toast({
          variant: 'destructive',
          title: 'Erro de Rede',
          description: 'Não foi possível buscar o orçamento.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamento();
  }, [user, orcamentoId, router, toast]);

  const handleUpdateOrcamento = async (orcamentoData: Omit<Orcamento, 'id' | 'dataCriacao' | 'status' | 'usuarioId'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Você precisa estar logado para atualizar um orçamento.',
      });
      return;
    }

    try {
      const finalData = {
        ...orcamentoData,
        dataUltimaEdicao: new Date().toISOString(),
      };
      await updateOrcamento(user.uid, orcamentoId, finalData);
      toast({
        title: 'Orçamento Atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });
      router.push('/dashboard/orcamento-judicial');
    } catch (error) {
      console.error("Erro ao atualizar orçamento: ", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
         <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard/orcamento-judicial">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        </div>
        <Card>
            <CardHeader><div className="h-6 bg-muted rounded w-1/4 animate-pulse" /></CardHeader>
            <CardContent><div className="h-24 bg-muted rounded w-full animate-pulse" /></CardContent>
        </Card>
         <Card>
            <CardHeader><div className="h-6 bg-muted rounded w-1/4 animate-pulse" /></CardHeader>
            <CardContent><div className="h-48 bg-muted rounded w-full animate-pulse" /></CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-destructive text-lg">{error}</p>
            <Link href="/dashboard/orcamento-judicial" passHref>
                <Button variant="link" className="mt-4">
                    Voltar para o Dashboard
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orcamento-judicial" passHref>
          <Button variant="secondary" size="icon" className='rounded-full'>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Orçamento</h1>
            <p className="text-muted-foreground">Paciente: {orcamento?.paciente.identificador}</p>
        </div>
      </div>
      
      {orcamento && (
        <OrcamentoForm 
          onSave={handleUpdateOrcamento}
          initialData={orcamento}
          isEditing={true}
        />
      )}
    </div>
  );
}
