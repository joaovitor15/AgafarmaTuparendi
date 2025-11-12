'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import messages from '@/locales/messages.pt-br.json';
import {
  generateOrcamentoPDF,
  generateVencidosPDF,
  generateDevolucaoPDF,
} from '@/lib/pdf-generator';
import type { OrcamentoData, VencidoData, DevolucaoData } from '@/types';

export function usePDF() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGeneration = async (generationFn: () => void) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Usuário não autenticado.',
      });
      return;
    }

    setLoading(true);
    toast({
      title: messages.pdf.generatingPDF,
    });

    try {
      // The actual PDF generation is asynchronous with html2canvas
      await new Promise(resolve => setTimeout(resolve, 500)); 
      generationFn();
      toast({
        variant: 'default',
        title: 'Sucesso',
        description: messages.pdf.pdfGeneratedSuccess,
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: messages.pdf.errorGeneratingPDF,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateOrcamento = (data: OrcamentoData) => {
    handleGeneration(() => generateOrcamentoPDF(data, user!.displayName || 'N/A'));
  };

  const generateVencidos = (data: VencidoData[]) => {
    handleGeneration(() => generateVencidosPDF(data, user!.displayName || 'N/A'));
  };

  const generateDevolucao = (data: DevolucaoData) => {
    handleGeneration(() => generateDevolucaoPDF(data, user!.displayName || 'N/A'));
  };

  return { generateOrcamento, generateVencidos, generateDevolucao, loading };
}
