'use client';

import { VencidoForm } from '@/components/vencidos/VencidoForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { VencidoItem } from '@/types/vencido';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditarVencidoPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState<VencidoItem | null>(null);
  const [loading, setLoading] = useState(true);

  const vencidoId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!user || !vencidoId) return;

    const fetchItem = async () => {
      try {
        const docRef = doc(db, `users/${user.uid}/vencidos`, vencidoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInitialData({ id: docSnap.id, ...docSnap.data() } as VencidoItem);
        } else {
          toast({ variant: 'destructive', title: 'Item não encontrado.' });
          router.replace('/dashboard/vencidos');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao carregar item.' });
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [user, vencidoId, router, toast]);

  const handleSave = async (data: Omit<VencidoItem, 'id' | 'dataCriacao' | 'dataUltimaEdicao'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Erro de autenticação.' });
      return;
    }

    try {
      const docRef = doc(db, `users/${user.uid}/vencidos`, vencidoId);
      await updateDoc(docRef, {
        ...data,
        dataUltimaEdicao: new Date().toISOString(),
      });
      toast({ title: 'Item atualizado com sucesso!' });
      router.push('/dashboard/vencidos');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({ variant: 'destructive', title: 'Erro ao atualizar o item.' });
    }
  };

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-8 w-1/3" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    )
  }

  if (!initialData) {
    return null; // ou um componente de "não encontrado"
  }

  return <VencidoForm onSave={handleSave} initialData={initialData} isEditing />;
}
