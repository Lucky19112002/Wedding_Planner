import { Card } from '@/components/ui/Card';

type SummaryCardProps = {
  label: string;
  value: number | string;
};

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Card className="transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Card>
  );
}
