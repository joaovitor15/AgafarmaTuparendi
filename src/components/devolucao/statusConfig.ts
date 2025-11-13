'use client';
import type { StatusDevolucao } from '@/types';
import { Loader2, PackageSearch, Truck, Banknote, CheckCircle2, LucideIcon } from 'lucide-react';

export const statusConfig: Record<StatusDevolucao, { 
    label: string; 
    description: string;
    badgeClassName: string; 
    icon: LucideIcon;
}> = {
  solicitacao_nfd: {
    label: 'Solicitação NFD',
    description: 'Aguardando o envio da Nota Fiscal de Devolução (NFD) pela distribuidora.',
    badgeClassName: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: PackageSearch,
  },
  aguardar_coleta: {
    label: 'Aguardar Coleta',
    description: 'A NFD foi recebida. Preencha os dados e aguarde a coleta pela transportadora.',
    badgeClassName: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: Truck,
  },
  aguardando_credito: {
    label: 'Aguardando Crédito',
    description: 'O produto foi coletado. Preencha a data da coleta e aguarde o crédito do valor.',
    badgeClassName: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: Banknote,
  },
  devolucao_finalizada: {
    label: 'Finalizada',
    description: 'O crédito foi recebido e o processo de devolução foi concluído com sucesso.',
    badgeClassName: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
  },
};

export const getEtapa = (status: StatusDevolucao): number => {
    switch (status) {
        case 'solicitacao_nfd': return 1;
        case 'aguardar_coleta': return 2;
        case 'aguardando_credito': return 3;
        case 'devolucao_finalizada': return 4;
        default: return 0;
    }
}

export const proximoStatus = (statusAtual: StatusDevolucao): StatusDevolucao | null => {
    switch (statusAtual) {
        case 'solicitacao_nfd': return 'aguardar_coleta';
        case 'aguardar_coleta': return 'aguardando_credito';
        case 'aguardando_credito': return 'devolucao_finalizada';
        case 'devolucao_finalizada': return null;
        default: return null;
    }
}
