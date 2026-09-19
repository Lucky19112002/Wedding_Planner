import { cx } from '@/utils/cx';

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  name?: string;
};

export function Avatar({ className, name = 'User', ...props }: AvatarProps) {
  return (
    <div
      className={cx(
        'flex size-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700',
        className,
      )}
      {...props}
    >
      {name.trim().slice(0, 1).toUpperCase()}
    </div>
  );
}
