'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import type { Orcamento } from '@/types/orcamento';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption } from '@/components/ui/table';
import { FileDown, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function OrcamentoJudicialPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | undefined>(undefined);
  const { toast } = useToast();

  const handleSaveOrcamento = (orcamentoData: Orcamento) => {
    // Em uma implementação real, isso salvaria no Firebase/banco de dados
    console.log('Salvando orçamento:', orcamentoData);
    
    // Adiciona ou atualiza um orçamento
    const existingIndex = orcamentos.findIndex(o => o.id === orcamentoData.id);

    if (existingIndex > -1) {
      const updatedOrcamentos = [...orcamentos];
      updatedOrcamentos[existingIndex] = { ...orcamentoData, id: orcamentoData.id || uuidv4() };
      setOrcamentos(updatedOrcamentos);
      toast({
        title: 'Orçamento Atualizado!',
        description: 'O orçamento foi atualizado com sucesso.',
      });
    } else {
      const orcamentoComId = { ...orcamentoData, id: uuidv4() };
      setOrcamentos(prevOrcamentos => [...prevOrcamentos, orcamentoComId]);
      toast({
        title: 'Orçamento Salvo!',
        description: 'O orçamento foi salvo com sucesso.',
      });
    }
    setEditingOrcamento(undefined);
  };

  const handleEdit = (orcamento: Orcamento) => {
    setEditingOrcamento(orcamento);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleDelete = (id: string) => {
    setOrcamentos(orcamentos.filter(o => o.id !== id));
    toast({
      variant: 'destructive',
      title: 'Orçamento Excluído!',
      description: 'O orçamento foi removido da lista.',
    });
  }

  const handleCancelEdit = () => {
    setEditingOrcamento(undefined);
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Gerador de Orçamento Judicial</h1>
      
      <OrcamentoForm 
        key={editingOrcamento?.id || 'new'}
        onSave={handleSaveOrcamento} 
        initialData={editingOrcamento}
        onCancelEdit={editingOrcamento ? handleCancelEdit : undefined}
      />

      <Card>
          <CardContent className="pt-6">
            <Table>
                <TableCaption>{orcamentos.length === 0 ? "Nenhum orçamento salvo ainda." : "Lista de orçamentos salvos."}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Nº Medicamentos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orcamentos.map(orcamento => (
                        <TableRow key={orcamento.id}>
                            <TableCell className="font-medium">{orcamento.paciente.identificador}</TableCell>
                            <TableCell>{orcamento.paciente.cpf || 'N/A'}</TableCell>
                            <TableCell>{orcamento.medicamentos.length}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="icon" disabled>
                                    <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleEdit(orcamento)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o orçamento de
                                        "{orcamento.paciente.identificador}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(orcamento.id!)}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
