'use client';

import { useState } from 'react';
import { LogOut, Menu, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { navItems } from './Sidebar';
import { usePathname } from 'next/navigation';
import { AgafarmaLogo } from './AgafarmaLogo';
import messages from '@/locales/messages.pt-br.json';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOutUser, loading } = useAuth();


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <AgafarmaLogo className="h-8 w-8 text-primary" />
            <span>{messages.app.title}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 flex-1">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all",
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
         <SheetFooter className="p-4 border-t mt-auto">
            <Button
              onClick={signOutUser}
              disabled={loading}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-5 w-5 text-destructive" />
              <span className="text-destructive font-medium">{messages.auth.logout}</span>
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
