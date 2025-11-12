'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import messages from '@/locales/messages.pt-br.json';
import { AlertTriangle, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-destructive/10 p-4">
      <Card className="w-full max-w-md text-center border-destructive shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl text-destructive">{messages.accessDenied.title}</CardTitle>
          <CardDescription className="text-lg">
            {messages.accessDenied.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {messages.accessDenied.contact}
          </p>
          <Link href="/login" legacyBehavior>
            <Button variant="destructive" className="w-full text-base py-6">
              <LogIn className="mr-2 h-5 w-5" />
              {messages.accessDenied.backToLogin}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
