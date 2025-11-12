import messages from '@/locales/messages.pt-br.json';
import { AgafarmaLogo } from './AgafarmaLogo';

export function Header() {
  return (
    <header className="flex h-20 items-center border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <AgafarmaLogo className="h-10 w-10 text-primary" />
        <span className="text-xl font-semibold text-foreground">{messages.app.title}</span>
      </div>
    </header>
  );
}
