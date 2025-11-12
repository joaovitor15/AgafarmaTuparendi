'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/dashboard/orcamento-judicial', emoji: '📋', label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', emoji: '⏰', label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', emoji: '🔄', label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const { signOutUser, loading } = useAuth();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="hidden w-20 flex-col items-center gap-y-2 border-r bg-card p-2 md:flex">
        <nav className="flex flex-col items-center gap-2 w-full mt-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href} passHref legacyBehavior>
                    <a
                      className={cn(
                        'flex h-16 w-16 items-center justify-center rounded-lg text-3xl transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-label={item.label}
                    >
                      {item.emoji}
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
                <Button variant="ghost" size="icon" onClick={signOutUser} disabled={loading} className="h-16 w-16 rounded-lg">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <LogOut className="h-6 w-6" />}
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
