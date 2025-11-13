'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { TabelaOrcamentos } from '@/components/orcamento/TabelaOrcamentos';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrcamentoJudicialDashboardPage() {
  
  return (
    <>
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos Judiciais</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/orcamento-judicial/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        </div>

        <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Orçamentos</CardTitle>
              <CardDescription>Visualize, edite ou remova os orçamentos criados.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                 <TabelaOrcamentos />
              </Suspense>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
