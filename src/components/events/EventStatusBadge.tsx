import { eventStatusLabels } from '@/utils/eventWorkflow';
import { cx } from '@/utils/cx';
import type { EventStatus } from '@/types/domain';

const badgeClass: Record<EventStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  planned: 'bg-sky-50 text-sky-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-violet-50 text-violet-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={cx('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', badgeClass[status])}>
      {eventStatusLabels[status]}
    </span>
  );
}
