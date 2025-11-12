'use client';

import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { AgafarmaLogo } from './AgafarmaLogo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  const { user } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name[0];
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <AgafarmaLogo className="h-10 w-10 text-primary" />
        <span className="text-lg font-semibold text-foreground">{messages.app.title}</span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
           <div className="text-right">
             <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{user.displayName}</p>
             <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
           </div>
          <Avatar>
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
