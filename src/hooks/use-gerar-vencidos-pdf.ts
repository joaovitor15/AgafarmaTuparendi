'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { VencidoItem, DestinatarioVencidos } from '@/types/vencido';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Augment jsPDF with autoTable
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export function useGerarVencidosPDF() {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const { toast } = useToast();

  const gerarPDF = (
    vencidos: VencidoItem[],
    tipo: 'Nota' | 'Descarte',
    destinatario: DestinatarioVencidos | null
  ) => {
    setLoadingPDF(true);
    toast({ title: 'Gerando PDF...', description: 'Aguarde um instante.' });

    try {
      const doc = new jsPDF();
      const dataFormatada = format(new Date(), 'dd-MM-yyyy');

      if (tipo === 'Nota') {
        gerarPDFNota(doc, vencidos, destinatario);
        doc.save(`Pedido de NFD - ${dataFormatada}.pdf`);
      } else {
        gerarPDFDescarte(doc, vencidos);
        doc.save(`Etiqueta Descarte - ${dataFormatada}.pdf`);
      }

      toast({ title: 'PDF gerado com sucesso!', description: 'O download deve começar em breve.' });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({ variant: 'destructive', title: 'Erro ao gerar PDF', description: 'Ocorreu um problema, tente novamente.' });
    } finally {
      setLoadingPDF(false);
    }
  };

  const gerarPDFNota = (doc: jsPDF, vencidos: VencidoItem[], destinatario: DestinatarioVencidos | null) => {
    doc.setFont('Arial', 'bold');
    doc.setFontSize(14);
    doc.text('Solicitação de NFD', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFont('Arial', 'normal');
    doc.setFontSize(11);
    const desc = "Solicito NFD, para dar baixa no sistema SNGPC, dos produtos controlado e antimicrobiano, conforme a RDC 344/98.";
    const splitDesc = doc.splitTextToSize(desc, doc.internal.pageSize.getWidth() - 40);
    doc.text(splitDesc, 20, 30);

    if (destinatario) {
        doc.setFont('Arial', 'bold');
        doc.text('DESTINATÁRIO:', 20, 50);
        doc.setFont('Arial', 'normal');
        let y = 56;
        doc.text(`Razão Social: ${destinatario.razaoSocial}`, 20, y);
        y += 6;
        doc.text(`CNPJ: ${destinatario.cnpj}`, 20, y);
        y += 6;
        doc.text(`Endereço: ${destinatario.endereco}`, 20, y);
        y += 6;
        doc.text(`Cidade: ${destinatario.cidade}`, 20, y);
        y += 6;
        doc.text(`CEP: ${destinatario.cep}`, 20, y);
    }
    
    const head = [['Código', 'Medicamento', 'Qtd', 'Lote', 'NCM', 'CEST', 'CFOP', 'Preço Unit', 'Total']];
    const body = vencidos.map(item => [
      '', // Código
      item.medicamento,
      item.quantidade,
      item.lote,
      item.ncm,
      item.cest,
      item.cfop,
      `R$ ${item.precoUnitario.toFixed(2)}`,
      `R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`
    ]);

    doc.autoTable({
        startY: (destinatario ? 90 : 50),
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        columnStyles: {
            // Defina as larguras como achar melhor
            0: { cellWidth: 20 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 15 },
            8: { halign: 'right' },
            7: { halign: 'right' },
        }
    });
  };

  const gerarPDFDescarte = (doc: jsPDF, vencidos: VencidoItem[]) => {
     doc.setFont('Arial', 'bold');
    doc.setFontSize(14);
    doc.text('MEDICAMENTOS VENCIDOS (PORTARIA 344/98 e Antimicrobianos)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFont('Arial', 'normal');
    doc.setFontSize(11);
    const desc1 = "Por meio deste, estão recolhendo os seguintes medicamentos sujeitos ao controle especial (portaria 344/98) e os antimicrobianos.";
    const desc2 = "Ficando com a ARL Coleta e transporte de Resíduos LTDA, no momento da coleta.";
    doc.text(doc.splitTextToSize(desc1, doc.internal.pageSize.getWidth() - 40), 20, 30);
    doc.text(doc.splitTextToSize(desc2, doc.internal.pageSize.getWidth() - 40), 20, 45);

    const head = [['Medicamentos', 'Qtd', 'Fabricante', 'MS', 'Lote', 'EAN']];
    const body = vencidos.map(item => [
      item.medicamento,
      item.quantidade,
      item.laboratorio,
      item.msRegistro,
      item.lote,
      item.codigoBarras
    ]);

    doc.autoTable({
        startY: 60,
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || doc.internal.pageSize.getHeight() - 50;
    doc.text('_____________________________', doc.internal.pageSize.getWidth() / 2, finalY + 30, { align: 'center' });
    doc.text('João Vitor Machry', doc.internal.pageSize.getWidth() / 2, finalY + 37, { align: 'center' });
    doc.text('CRF/RS: 586549', doc.internal.pageSize.getWidth() / 2, finalY + 44, { align: 'center' });
  };


  return { gerarPDF, loadingPDF };
}
