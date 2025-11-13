'use client';

import type { Devolucao } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { statusConfig } from './statusConfig';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '../ui/alert-dialog';
import { EmptyState } from '../ui/empty-state';

interface DevolucaoListaProps {
  devolucoesAgrupadas: Record<string, Devolucao[]>;
  onEditar: (devolucao: Devolucao) => void;
  onExcluir: (id: string) => void;
}

export function DevolucaoLista({
  devolucoesAgrupadas,
  onEditar,
  onExcluir,
}: DevolucaoListaProps) {
  const notasFiscais = Object.keys(devolucoesAgrupadas);
  
  const getStatusNota = (devolucoes: Devolucao[]) => {
      const statusSet = new Set(devolucoes.map(d => d.status));
      if (statusSet.size === 1) {
          const status = statusSet.values().next().value;
          return statusConfig[status]?.label || 'Status Desconhecido';
      }
      return 'Múltiplos Status';
  }

  if (notasFiscais.length === 0) {
    return (
        <div className='py-12'>
            <EmptyState
                icon={<div className="text-4xl">📦</div>}
                title="Nenhuma devolução encontrada"
                description="Nenhuma devolução corresponde aos filtros selecionados. Tente limpar os filtros para ver todos os itens."
            />
        </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {notasFiscais.map((notaFiscal) => {
        const devolucoes = devolucoesAgrupadas[notaFiscal];
        const statusNota = getStatusNota(devolucoes);

        return (
          <AccordionItem value={notaFiscal} key={notaFiscal} className="border bg-card rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors w-full">
              <div className="flex items-center justify-between w-full">
                <div className='text-left'>
                  <p className="text-sm text-muted-foreground">Nota Fiscal</p>
                  <p className="font-bold text-lg text-foreground">{notaFiscal}</p>
                </div>
                <div className='text-right'>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold text-primary">{statusNota}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devolucoes.map((dev) => {
                      const config = statusConfig[dev.status];
                      return (
                        <TableRow key={dev.id}>
                          <TableCell>
                            {new Date(dev.dataRealizada).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </TableCell>
                          <TableCell className='font-medium'>{dev.produto}</TableCell>
                          <TableCell>{dev.quantidade}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('border-2', config?.badgeClassName)}>
                              {config?.label || dev.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => onEditar(dev)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                   <Button
                                      variant="destructive"
                                      size="icon"
                                      className="rounded-full"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. A devolução será permanentemente excluída.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onExcluir(dev.id)}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}