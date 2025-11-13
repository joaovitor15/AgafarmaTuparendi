'use client';

import { db } from '@/lib/firebase';
import type { Devolucao } from '@/types';
import { doc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

const DEVOLUCAO_COLLECTION = 'devolucao';

/**
 * Adiciona uma nova devolução no Firestore para um usuário específico.
 * @param userId - O ID do usuário.
 * @param devolucaoData - O objeto de devolução a ser salvo, sem o ID.
 * @returns O ID da nova devolução.
 */
export const addDevolucao = async (userId: string, devolucaoData: Omit<Devolucao, 'id'>): Promise<string> => {
  try {
    const devolucaoCollectionRef = collection(db, 'users', userId, DEVOLUCAO_COLLECTION);
    const newDocRef = await addDoc(devolucaoCollectionRef, devolucaoData);
    // Opcionalmente, atualizar o documento com seu próprio ID
    await updateDoc(newDocRef, { id: newDocRef.id });
    return newDocRef.id;
  } catch (error) {
    console.error("Erro ao adicionar devolução: ", error);
    throw new Error('Falha ao salvar a devolução.');
  }
};


/**
 * Atualiza uma devolução existente no Firestore.
 * @param userId - O ID do usuário.
 * @param devolucaoId - O ID da devolução a ser atualizada.
 * @param devolucaoData - Os dados a serem atualizados.
 */
export const updateDevolucao = async (userId: string, devolucaoId: string, devolucaoData: Partial<Devolucao>): Promise<void> => {
  try {
    const devolucaoDocRef = doc(db, 'users', userId, DEVOLUCAO_COLLECTION, devolucaoId);
    await updateDoc(devolucaoDocRef, devolucaoData);
  } catch (error) {
    console.error("Erro ao atualizar devolução: ", error);
    throw new Error('Falha ao atualizar a devolução.');
  }
};

/**
 * Exclui uma devolução existente no Firestore.
 * @param userId - O ID do usuário.
 * @param devolucaoId - O ID da devolução a ser excluída.
 */
export const deleteDevolucao = async (userId: string, devolucaoId: string): Promise<void> => {
    try {
        const devolucaoDocRef = doc(db, 'users', userId, DEVOLUCAO_COLLECTION, devolucaoId);
        await deleteDoc(devolucaoDocRef);
    } catch (error) {
        console.error("Erro ao excluir devolução: ", error);
        throw new Error('Falha ao excluir a devolução.');
    }
}
