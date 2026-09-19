import { forwardRef } from 'react';
import { cx } from '@/utils/cx';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, ...props }, ref) => (
  <label className="block">
    {label ? <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> : null}
    <select
      ref={ref}
      className={cx(
        'min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200',
        className,
      )}
      {...props}
    />
  </label>
));

Select.displayName = 'Select';
