'use client';
import type { StatusDevolucao } from '@/types';

export const statusConfig: Record<StatusDevolucao, { label: string; badgeClassName: string, checkboxClassName: string }> = {
  solicitacao_nfd: {
    label: 'Solicitação NFD',
    badgeClassName: 'bg-amber-100 text-amber-800 border-amber-300',
    checkboxClassName: 'data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500',
  },
  aguardar_coleta: {
    label: 'Aguardar Coleta',
    badgeClassName: 'bg-sky-100 text-sky-800 border-sky-300',
    checkboxClassName: 'data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500',
  },
  aguardando_credito: {
    label: 'Aguardando Crédito',
    badgeClassName: 'bg-orange-100 text-orange-800 border-orange-300',
    checkboxClassName: 'data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500',
  },
  devolucao_finalizada: {
    label: 'Finalizada',
    badgeClassName: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    checkboxClassName: 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500',
  },
};
