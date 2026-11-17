import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label?: string;
  value?: string;
  delta?: string;
  loading?: boolean;
}

export function StatCard({ label, value, delta, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card className="max-w-sm my-2">
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-5 bg-muted animate-pulse rounded-full w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = delta?.startsWith('+');

  return (
    <Card className="max-w-sm my-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {delta && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              {delta}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}