'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { AgafarmaLogo } from './AgafarmaLogo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutIcon } from './icons';

export function Header() {
  const { user, signOutUser, loading } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name[0];
  };

  return (
    <header className={cn(
      "flex h-16 w-full flex-shrink-0 items-center justify-between px-4",
      "bg-card"
    )}>
      <div className="flex items-center gap-3">
        <AgafarmaLogo className="h-10 w-10 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">{messages.app.title}</h1>
      </div>
      {user && (
        <div className="flex items-center gap-4">
           <div className="hidden text-right md:block">
             <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{user.displayName}</p>
             <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
           </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
           <button 
             onClick={signOutUser} 
             disabled={loading} 
             className={cn(
              "md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
             )}
             aria-label="Sair"
           >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogoutIcon className="h-5 w-5" />}
           </button>
        </div>
      )}
    </header>
  );
}
