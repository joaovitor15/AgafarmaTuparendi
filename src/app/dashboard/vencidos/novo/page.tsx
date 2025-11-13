'use client';
import { VencidoForm } from '@/components/vencidos/VencidoForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { VencidoItem } from '@/types/vencido';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NovoVencidoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async (data: Omit<VencidoItem, 'id' | 'dataCriacao' | 'dataUltimaEdicao'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Erro de autenticação.' });
      return;
    }
    
    try {
      const vencidosCollection = collection(db, `users/${user.uid}/vencidos`);
      const now = new Date().toISOString();
      await addDoc(vencidosCollection, {
        ...data,
        dataCriacao: now,
        dataUltimaEdicao: now,
      });
      toast({ title: 'Item vencido salvo com sucesso!' });
      router.push('/dashboard/vencidos');
      router.refresh();
    } catch (error) {
      console.error('Erro ao salvar item vencido:', error);
      toast({ variant: 'destructive', title: 'Erro ao salvar item.' });
    }
  };

  return <VencidoForm onSave={handleSave} />;
}
