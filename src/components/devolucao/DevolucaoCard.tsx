'use client';

import { useState } from 'react';
import type { Devolucao, DevolucaoProduto } from '@/types';
import { statusConfig, getEtapa, proximoStatus } from './statusConfig';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Alert, AlertDescription } from '../ui/alert';

interface DevolucaoCardProps {
    devolucao: Devolucao;
    onUpdate: (devolucao: Devolucao) => void;
    onExcluir: (id: string) => void;
    iniciaExpandido?: boolean;
}

export function DevolucaoCard({ devolucao, onUpdate, onExcluir, iniciaExpandido = false }: DevolucaoCardProps) {
    const [isExpanded, setIsExpanded] = useState(iniciaExpandido);
    const [showHistory, setShowHistory] = useState(false);
    const [formData, setFormData] = useState<Partial<Devolucao>>(devolucao);
    const [showAlertaNFD, setShowAlertaNFD] = useState(false);

    const config = statusConfig[devolucao.status];
    const etapa = getEtapa(devolucao.status);
    const produtoPrincipal = devolucao.produtos[0]?.nome || 'Múltiplos produtos';
    const totalProdutos = devolucao.produtos.length;

    const handleProximaEtapa = () => {
        const proximo = proximoStatus(devolucao.status);
        if (proximo) {
            onUpdate({ ...formData, status: proximo } as Devolucao);
            if (proximo === 'devolucao_finalizada') {
                setIsExpanded(false);
            }
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }

    const renderEtapa1ReadOnly = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <InfoItem label="Data da Solicitação" value={new Date(formData.dataRealizada).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
             <InfoItem label="Distribuidora" value={formData.distribuidora} />
             <InfoItem label="Motivo" value={formData.motivo} />
             <InfoItem label="NF de Entrada" value={formData.notaFiscalEntrada} />
             {formData.protocolo && <InfoItem label="Protocolo" value={formData.protocolo} />}
        </div>
    );
    
    const renderProdutos = () => (
        <div className='space-y-2'>
            {devolucao.produtos.map((p, i) => (
                <div key={i} className='text-sm bg-background p-2 rounded-md border'>
                   - {p.nome} ({p.quantidade} un)
                </div>
            ))}
        </div>
    );

    const renderEtapa1Inputs = () => (
         <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`protocolo-${devolucao.id}`}>Protocolo</Label>
                <Input id={`protocolo-${devolucao.id}`} name="protocolo" value={formData.protocolo || ''} onChange={handleInputChange} />
            </div>
        </div>
    );

    const renderEtapa2Inputs = () => (
        <div className="space-y-4">
            {showAlertaNFD && (
                 <Alert variant="default" className='bg-amber-100 border-amber-300 text-amber-900'>
                    <AlertCircle className="h-4 w-4 !text-amber-900" />
                    <AlertDescription>
                        Lembre-se de imprimir a Nota Fiscal de Devolução (NFD) para a transportadora.
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor={`nfdNumero-${devolucao.id}`}>Número NFD</Label>
                <Input id={`nfdNumero-${devolucao.id}`} name="nfdNumero" value={formData.nfdNumero || ''} onChange={handleInputChange} onFocus={() => setShowAlertaNFD(true)} onBlur={() => setShowAlertaNFD(false)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`nfdValor-${devolucao.id}`}>Valor NFD</Label>
                <Input id={`nfdValor-${devolucao.id}`} name="nfdValor" type="number" placeholder="R$" value={formData.nfdValor || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`nfSaida-${devolucao.id}`}>NF Saída</Label>
                <Input id={`nfSaida-${devolucao.id}`} name="nfSaida" value={formData.nfSaida || ''} onChange={handleInputChange} />
            </div>
        </div>
    );

    const renderEtapa3Inputs = () => (
        <div className="space-y-2">
            <Label htmlFor={`dataColeta-${devolucao.id}`}>Data da Coleta</Label>
            <Input id={`dataColeta-${devolucao.id}`} name="dataColeta" type="date" value={formData.dataColeta || ''} onChange={handleInputChange} />
        </div>
    );

    const renderEtapaFinalizada = () => (
         <div className='flex flex-col items-center text-center gap-4 py-4'>
            <CheckCircle2 className='h-12 w-12 text-emerald-500' />
            <div>
                <p className='font-semibold'>Devolução Finalizada</p>
                <p className='text-sm text-muted-foreground'>O crédito foi recebido e o processo concluído.</p>
            </div>
        </div>
    );

    const renderEtapaAtual = () => {
        switch (devolucao.status) {
            case 'solicitacao_nfd':
                return renderEtapa2Inputs();
            case 'aguardar_coleta':
                return renderEtapa3Inputs();
            case 'aguardando_credito':
                 return renderEtapaFinalizada(); // This is the step before it's finalized
            case 'devolucao_finalizada':
                return renderEtapaFinalizada();
            default:
                return null;
        }
    }
    
    const EtapaHistorico = ({ numero, titulo, concluida, children }: { numero: number; titulo: string; concluida: boolean, children: React.ReactNode }) => (
        <div>
            <div className='flex items-center gap-2 mb-2'>
                <div className={cn('flex items-center justify-center h-6 w-6 rounded-full', concluida ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground')}>
                    <CheckCircle2 className='h-4 w-4' />
                </div>
                <div className={cn('font-semibold text-sm', concluida ? 'text-foreground' : 'text-muted-foreground')}>
                    ETAPA {numero}: {titulo} {concluida && '(Concluída)'}
                </div>
            </div>
            <div className='pl-8 border-l-2 ml-3'>
                <div className='pl-4 text-xs bg-muted/40 p-3 rounded-md'>
                     {children}
                </div>
            </div>
        </div>
    );

    const renderHistorico = () => {
        const historicoEtapas = [];
        if (etapa >= 1) {
            historicoEtapas.push(
                <EtapaHistorico key="etapa1" numero={1} titulo="Dados Iniciais" concluida={true}>
                    {renderEtapa1ReadOnly()}
                    <div className='mt-2'>
                        {renderProdutos()}
                    </div>
                </EtapaHistorico>
            );
        }
        if (etapa > 1 && devolucao.status !== 'solicitacao_nfd') {
            historicoEtapas.push(
                <EtapaHistorico key="etapa2" numero={2} titulo="Aguardar Coleta" concluida={etapa > 2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem label="NFD Número" value={devolucao.nfdNumero || 'N/A'} />
                        <InfoItem label="Valor NFD" value={devolucao.nfdValor ? `R$ ${devolucao.nfdValor.toFixed(2)}` : 'N/A'} />
                        <InfoItem label="NF Saída" value={devolucao.nfSaida || 'N/A'} />
                    </div>
                </EtapaHistorico>
            );
        }
        if (etapa > 2 && devolucao.status !== 'aguardar_coleta') {
             historicoEtapas.push(
                <EtapaHistorico key="etapa3" numero={3} titulo="Aguardando Crédito" concluida={etapa > 3}>
                    <InfoItem label="Data da Coleta" value={devolucao.dataColeta ? new Date(devolucao.dataColeta).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'} />
                </EtapaHistorico>
            );
        }

        return <div className='space-y-6'>{historicoEtapas}</div>
    };

    return (
        <Card className={cn('overflow-hidden transition-all', isExpanded && 'shadow-lg')}>
            <CardHeader className='flex-row items-start justify-between gap-4 p-4 cursor-pointer hover:bg-muted/50' onClick={() => setIsExpanded(!isExpanded)}>
                <div className='flex-1 space-y-1'>
                    <p className='font-bold text-foreground'>{totalProdutos > 1 ? `${totalProdutos} produtos` : (produtoPrincipal || 'Devolução sem produto')}</p>
                    <p className='text-sm text-muted-foreground'>NF Entrada: {devolucao.notaFiscalEntrada}</p>
                </div>
                <div className='flex flex-col items-end gap-1'>
                    <Badge variant="outline" className={cn('whitespace-nowrap border-2', config.badgeClassName)}>
                        <config.icon className="mr-1.5 h-3.5 w-3.5" />
                        {config.label}
                    </Badge>
                     <p className='text-xs text-muted-foreground'>Etapa {etapa}/4</p>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className='p-4 border-t'>
                    {showHistory && (
                        <div className='mb-6 pb-6 border-b'>
                            {renderHistorico()}
                        </div>
                    )}
                    
                    <div className='font-semibold mb-1 text-sm text-foreground'>AÇÃO NECESSÁRIA: {config.label}</div>
                    <div className="mb-4 text-xs text-muted-foreground">{config.description}</div>

                    {renderEtapaAtual()}
                </CardContent>
            )}

            {isExpanded && (
                <CardFooter className="p-4 bg-muted/50 border-t flex-col sm:flex-row items-center justify-between gap-2">
                    <div className='flex items-center gap-2'>
                        {etapa > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                                {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
                                <ChevronDown className={cn('ml-1.5 h-4 w-4 transition-transform', showHistory && 'rotate-180')} />
                            </Button>
                        )}
                    </div>
                     <div className="flex w-full sm:w-auto items-center justify-end gap-2">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className='text-destructive hover:text-destructive hover:bg-destructive/10'>Cancelar Devolução</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancelar esta devolução?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. A devolução será permanentemente excluída do sistema.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Manter</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onExcluir(devolucao.id)}>Sim, Cancelar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {devolucao.status !== 'devolucao_finalizada' && (
                             <Button onClick={handleProximaEtapa}>
                                {devolucao.status === 'aguardando_credito' ? 'Finalizar Devolução' : 'Próxima Etapa'}
                            </Button>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
);
