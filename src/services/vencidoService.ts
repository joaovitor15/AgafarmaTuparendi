'use client';

import { db } from '@/lib/firebase';
import type { VencidoItem } from '@/types/vencido';
import { doc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

const VENCIDOS_COLLECTION = 'vencidos';

export const addVencido = async (userId: string, data: Omit<VencidoItem, 'id'>): Promise<string> => {
  try {
    const collectionRef = collection(db, 'users', userId, VENCIDOS_COLLECTION);
    const newDocRef = await addDoc(collectionRef, data);
    await updateDoc(newDocRef, { id: newDocRef.id });
    return newDocRef.id;
  } catch (error) {
    console.error("Erro ao adicionar item vencido: ", error);
    throw new Error('Falha ao salvar o item.');
  }
};

export const updateVencido = async (userId: string, id: string, data: Partial<VencidoItem>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, VENCIDOS_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Erro ao atualizar item vencido: ", error);
    throw new Error('Falha ao atualizar o item.');
  }
};

export const deleteVencido = async (userId: string, id: string): Promise<void> => {
    try {
        const docRef = doc(db, 'users', userId, VENCIDOS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Erro ao excluir item vencido: ", error);
        throw new Error('Falha ao excluir o item.');
    }
}
