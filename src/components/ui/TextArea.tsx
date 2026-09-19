import { forwardRef } from 'react';
import { cx } from '@/utils/cx';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, ...props }, ref) => (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea
        ref={ref}
        className={cx(
          'min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200',
          className,
        )}
        {...props}
      />
    </label>
  ),
);

TextArea.displayName = 'TextArea';
