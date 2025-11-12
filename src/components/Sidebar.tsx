'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { DevolucaoIcon, OrcamentoIcon, VencidosIcon, LogoutIcon } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const navItems = [
  { href: '/dashboard/orcamento-judicial', icon: OrcamentoIcon, label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', icon: VencidosIcon, label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', icon: DevolucaoIcon, label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const { signOutUser, loading } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden w-20 flex-col items-center border-r bg-card p-2 md:flex">
      <nav className="flex flex-col items-center gap-4 w-full mt-2">
        <TooltipProvider delayDuration={100}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href} passHref legacyBehavior>
                    <a
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
                      )}
                      aria-label={item.label}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
      <div className="mt-auto flex flex-col items-center gap-2 mb-2">
        <TooltipProvider delayDuration={100}>
           <Tooltip>
             <TooltipTrigger asChild>
                <button
                  onClick={signOutUser}
                  disabled={loading}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200',
                    'bg-destructive/90 text-destructive-foreground hover:bg-destructive',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive'
                  )}
                  aria-label={messages.auth.logout}
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <LogoutIcon className="h-6 w-6" />}
                </button>
             </TooltipTrigger>
             <TooltipContent side="right">
                <p>{messages.auth.logout}</p>
             </TooltipContent>
           </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
