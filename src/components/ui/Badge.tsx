import { cx } from '@/utils/cx';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        'inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700',
        className,
      )}
      {...props}
    />
  );
}
