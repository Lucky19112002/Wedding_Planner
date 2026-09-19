import { eventStatuses, eventStatusLabels } from '@/utils/eventWorkflow';
import { cx } from '@/utils/cx';
import type { EventStatus } from '@/types/domain';

export function EventTimeline({ status }: { status: EventStatus }) {
  const activeIndex = eventStatuses.indexOf(status);

  return (
    <ol className="space-y-3">
      {eventStatuses.map((item, index) => {
        const isActive = item === status;
        const isPast = status !== 'cancelled' && index < activeIndex;

        return (
          <li className="flex gap-3" key={item}>
            <span
              className={cx(
                'mt-1 size-3 shrink-0 rounded-full',
                isActive || isPast ? 'bg-brand-600' : 'bg-slate-200',
                item === 'cancelled' && isActive && 'bg-rose-600',
              )}
            />
            <div>
              <p className={cx('text-sm font-medium', isActive ? 'text-slate-950' : 'text-slate-600')}>
                {eventStatusLabels[item]}
              </p>
              {isActive ? <p className="text-xs text-slate-500">Current status</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
