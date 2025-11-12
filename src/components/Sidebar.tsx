'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { Button } from '@/components/ui/button';
import { ClipboardList, Clock, LogOut, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AgafarmaLogo } from './AgafarmaLogo';

const navItems = [
  { href: '/dashboard/orcamento-judicial', icon: ClipboardList, label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', icon: Clock, label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', icon: RefreshCw, label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const { signOutUser, loading } = useAuth();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="flex w-20 flex-col items-center gap-y-4 border-r bg-card p-2">
        <div className="p-2">
            <AgafarmaLogo className="h-10 w-10 text-primary" />
        </div>
        <nav className="flex flex-col items-center gap-2 w-full mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href} legacyBehavior>
                    <a
                      className={cn(
                        'flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-label={item.label}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="mt-1 text-xs">{item.label}</span>
                    </a>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={signOutUser} disabled={loading} className="h-12 w-12 rounded-lg">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{messages.auth.logout}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
