import { cx } from '@/utils/cx';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200', className)}
      {...props}
    />
  );
}
