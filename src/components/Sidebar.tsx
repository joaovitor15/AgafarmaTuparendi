'use client';

import messages from '@/locales/messages.pt-br.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Clock, Notebook } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from './ui/button';


export const navItems = [
  { href: '/dashboard/orcamento-judicial', icon: FileText, label: messages.sidebar.orcamento },
  { href: '/dashboard/vencidos', icon: Clock, label: messages.sidebar.vencidos },
  { href: '/dashboard/devolucao', icon: Notebook, label: messages.sidebar.devolucao },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden h-full w-20 flex-col items-center border-r bg-card py-4 md:flex">
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
      </aside>
    </TooltipProvider>
  );
}
