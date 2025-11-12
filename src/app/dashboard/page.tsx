'use client';
import { useAuth } from '@/contexts/AuthContext';
import messages from '@/locales/messages.pt-br.json';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {messages.dashboard.welcome}, {user?.displayName?.split(' ')[0] || 'Usuário'}!
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{messages.app.subtitle}</CardTitle>
          <CardDescription>
            Utilize o menu lateral para navegar entre as seções.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
