'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { Button } from '@/components/ui/button';
import { ClipboardList, Clock, LogOut, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/dashboard/orcamento-judicial', icon: ClipboardList, label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', icon: Clock, label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', icon: RefreshCw, label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const { signOutUser, loading, user } = useAuth();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="flex flex-col items-center gap-y-8 bg-card border-r w-32 p-4">
        <nav className="flex flex-col items-center gap-6 w-full mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href} legacyBehavior>
                    <a
                      className={cn(
                        'flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-inner'
                          : 'bg-background hover:bg-muted'
                      )}
                      aria-label={item.label}
                    >
                      <item.icon className="h-8 w-8" />
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
        <div className="mt-auto flex flex-col items-center gap-4">
            {user && (
                 <div className="text-center">
                    <p className="text-sm font-medium text-foreground truncate max-w-[100px]">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">{user.email}</p>
                </div>
            )}
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={signOutUser} disabled={loading} className="w-16 h-16 rounded-full">
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
