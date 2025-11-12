'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2, LogOut, FileText, Clock, Undo2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from './ui/button';


const navItems = [
  { href: '/dashboard/orcamento-judicial', icon: FileText, label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', icon: Clock, label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', icon: Undo2, label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const { signOutUser, loading } = useAuth();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden h-full w-20 flex-col items-center justify-between border-r bg-card py-4 md:flex">
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <Link href={item.href} aria-label={item.label}>
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="w-full flex justify-center mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={signOutUser}
                disabled={loading}
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label={messages.auth.logout}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5 text-destructive" />}
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
