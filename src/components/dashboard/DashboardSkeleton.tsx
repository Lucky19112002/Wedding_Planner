import { Card } from '@/components/ui/Card';

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Card className="h-48 animate-pulse bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="h-24 animate-pulse bg-slate-100" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="h-80 animate-pulse bg-slate-100" />
        <Card className="h-80 animate-pulse bg-slate-100" />
      </div>
    </div>
  );
}
