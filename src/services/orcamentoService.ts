'use client';

import { db } from '@/lib/firebase';
import type { Orcamento } from '@/types/orcamento';
import { doc, setDoc, collection, getDoc, updateDoc } from 'firebase/firestore';

const ORCAMENTO_COLLECTION = 'orcamentoJudicial';

/**
 * Adiciona um novo orçamento no Firestore para um usuário específico.
 * @param userId - O ID do usuário.
 * @param orcamento - O objeto de orçamento a ser salvo.
 */
export const addOrcamento = async (userId: string, orcamento: Orcamento): Promise<void> => {
  try {
    const orcamentoDocRef = doc(db, 'users', userId, ORCAMENTO_COLLECTION, orcamento.id);
    await setDoc(orcamentoDocRef, orcamento);
  } catch (error) {
    console.error("Erro ao adicionar orçamento: ", error);
    throw new Error('Falha ao salvar o orçamento.');
  }
};


/**
 * Busca um orçamento específico no Firestore.
 * @param userId - O ID do usuário.
 * @param orcamentoId - O ID do orçamento a ser buscado.
 * @returns O objeto de orçamento ou null se não for encontrado.
 */
export const getOrcamento = async (userId: string, orcamentoId: string): Promise<Omit<Orcamento, 'id'> | null> => {
  try {
    const orcamentoDocRef = doc(db, 'users', userId, ORCAMENTO_COLLECTION, orcamentoId);
    const docSnap = await getDoc(orcamentoDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as Omit<Orcamento, 'id'>;
    } else {
      console.log("Nenhum orçamento encontrado!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar orçamento: ", error);
    throw new Error('Falha ao buscar o orçamento.');
  }
};

/**
 * Atualiza um orçamento existente no Firestore.
 * @param userId - O ID do usuário.
 * @param orcamentoId - O ID do orçamento a ser atualizado.
 * @param orcamentoData - Os dados a serem atualizados.
 */
export const updateOrcamento = async (userId: string, orcamentoId: string, orcamentoData: Partial<Orcamento>): Promise<void> => {
  try {
    const orcamentoDocRef = doc(db, 'users', userId, ORCAMENTO_COLLECTION, orcamentoId);
    await updateDoc(orcamentoDocRef, orcamentoData);
  } catch (error) {
    console.error("Erro ao atualizar orçamento: ", error);
    throw new Error('Falha ao atualizar o orçamento.');
  }
};
