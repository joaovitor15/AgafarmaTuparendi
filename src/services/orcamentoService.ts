'use client';

import { db } from '@/lib/firebase';
import type { Orcamento } from '@/types/orcamento';
import { doc, setDoc, collection } from 'firebase/firestore';

const ORCAMENTO_COLLECTION = 'orcamentoJudicial';

/**
 * Adiciona ou atualiza um orçamento no Firestore para um usuário específico.
 * @param userId - O ID do usuário.
 * @param orcamento - O objeto de orçamento a ser salvo.
 */
export const addOrcamento = async (userId: string, orcamento: Orcamento): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const orcamentoCollectionRef = collection(userDocRef, ORCAMENTO_COLLECTION);
    const orcamentoDocRef = doc(orcamentoCollectionRef, orcamento.id);
    
    await setDoc(orcamentoDocRef, orcamento);
  } catch (error) {
    console.error("Erro ao adicionar/atualizar orçamento: ", error);
    throw new Error('Falha ao salvar o orçamento.');
  }
};
