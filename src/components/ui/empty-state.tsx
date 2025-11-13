'use client';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './card';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
            {action && (
                <Button onClick={action.onClick}>{action.label}</Button>
            )}
        </CardContent>
    </Card>
  );
}
