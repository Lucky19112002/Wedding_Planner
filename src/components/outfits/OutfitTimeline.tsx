import { cx } from '@/utils/cx';
import { outfitStatuses, outfitStatusLabels } from '@/utils/outfitWorkflow';
import type { OutfitStatus } from '@/types/domain';

export function OutfitTimeline({ status }: { status: OutfitStatus }) {
  const activeIndex = outfitStatuses.indexOf(status);

  return (
    <ol className="space-y-3">
      {outfitStatuses.map((item, index) => {
        const isActive = item === status;
        const isPast = status !== 'dropped' && index < activeIndex;
        return (
          <li className="flex gap-3" key={item}>
            <span
              className={cx(
                'mt-1 size-3 shrink-0 rounded-full',
                isActive || isPast ? 'bg-brand-600' : 'bg-slate-200',
                item === 'dropped' && isActive && 'bg-rose-600',
              )}
            />
            <div>
              <p className={cx('text-sm font-medium', isActive ? 'text-slate-950' : 'text-slate-600')}>
                {outfitStatusLabels[item]}
              </p>
              {isActive ? <p className="text-xs text-slate-500">Current status</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
