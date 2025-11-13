'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { StatusDevolucao } from '@/types';
import { ListFilter, X } from 'lucide-react';
import { statusConfig } from './statusConfig';

interface DevolucaoFiltroDropdownProps {
  filtrosAtuais: StatusDevolucao[];
  onFiltroChange: (filtros: StatusDevolucao[]) => void;
}

const allStatus: StatusDevolucao[] = [
  'solicitacao_nfd',
  'aguardar_coleta',
  'aguardando_credito',
  'devolucao_finalizada',
];

export function DevolucaoFiltroDropdown({
  filtrosAtuais,
  onFiltroChange,
}: DevolucaoFiltroDropdownProps) {
  
  const handleCheckedChange = (status: StatusDevolucao, checked: boolean) => {
    const newFiltros = checked
      ? [...filtrosAtuais, status]
      : filtrosAtuais.filter((s) => s !== status);
    onFiltroChange(newFiltros);
  };

  const hasFilters = filtrosAtuais.length > 0;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" />
            Filtros
            {hasFilters && <span className="ml-2 rounded-full bg-primary px-2 text-xs text-primary-foreground">{filtrosAtuais.length}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allStatus.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filtrosAtuais.includes(status)}
              onCheckedChange={(checked) => handleCheckedChange(status, !!checked)}
            >
              {statusConfig[status].label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onFiltroChange([])}>
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
