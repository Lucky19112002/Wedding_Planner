import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry, title = 'Unable to load' }: ErrorStateProps) {
  return (
    <Card className="text-center">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {onRetry ? (
        <Button className="mt-5" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}
