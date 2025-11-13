'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { StatusDevolucao } from '@/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { statusConfig } from './statusConfig';

interface DevolucaoFiltroProps {
  filtroStatus: StatusDevolucao[];
  onFiltroChange: (filtros: StatusDevolucao[]) => void;
}

const allStatus: StatusDevolucao[] = [
  'solicitacao_nfd',
  'aguardar_coleta',
  'aguardando_credito',
  'devolucao_finalizada',
];

export function DevolucaoFiltro({ filtroStatus, onFiltroChange }: DevolucaoFiltroProps) {
  
  const handleCheckedChange = (status: StatusDevolucao) => {
    const newFiltros = filtroStatus.includes(status)
      ? filtroStatus.filter((s) => s !== status)
      : [...filtroStatus, status];
    onFiltroChange(newFiltros);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {allStatus.map((status) => {
        const config = statusConfig[status];
        return(
          <div key={status} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${status}`}
              checked={filtroStatus.includes(status)}
              onCheckedChange={() => handleCheckedChange(status)}
              className={cn('border-border', config.checkboxClassName)}
            />
            <Label htmlFor={`filter-${status}`} className="flex items-center cursor-pointer">
              <Badge variant="outline" className={cn('border-2', config.badgeClassName)}>
                {config.label}
              </Badge>
            </Label>
          </div>
        )
      })}
      {filtroStatus.length > 0 && (
        <Button variant="ghost" onClick={() => onFiltroChange([])}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
