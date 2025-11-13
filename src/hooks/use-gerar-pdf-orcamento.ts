'use client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { gerarNomeArquivo } from '@/lib/pdf-utils';
import { PDF_CONFIG } from '@/config/pdf-config';
import type { Orcamento } from '@/types/orcamento';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function useGerarPDFOrcamento() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const gerarPDF = async (orcamento: Orcamento) => {
    setLoading(true);
    toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde.",
    });

    try {
      // 1. Obter elemento HTML
      const element = document.getElementById('pdf-content');
      if (!element) {
        throw new Error('Elemento do template PDF não encontrado no DOM');
      }
      
      // 2. Converter para canvas usando html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Aumenta a resolução para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      // 3. Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Margens (em mm)
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      
      // Calcular a altura da imagem proporcionalmente
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // 4. Adicionar imagem em múltiplas páginas se necessário
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      // 5. Gerar nome do arquivo
      const nomeArquivo = gerarNomeArquivo(
        PDF_CONFIG.FORMATO_NOMES_FICHEIROS.ORCAMENTO,
        orcamento.paciente.identificador,
        new Date()
      );
      
      // 6. Baixar PDF
      pdf.save(`${nomeArquivo}.pdf`);

      toast({
        title: "Sucesso!",
        description: "PDF do orçamento foi gerado."
      });

    } catch (err: any) {
      console.error('Erro ao gerar PDF:', err);
      toast({
          variant: 'destructive',
          title: "Erro ao gerar PDF",
          description: err.message || 'Ocorreu um problema inesperado.'
      });
    } finally {
      setLoading(false);
    }
  };

  return { gerarPDF, loading };
}

    