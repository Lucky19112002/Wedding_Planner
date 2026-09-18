import { Card } from '@/components/ui/Card';

type EmptyStateProps = {
  children?: React.ReactNode;
  title: string;
  description?: string;
};

export function EmptyState({ children, description, title }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      {children}
    </Card>
  );
}
