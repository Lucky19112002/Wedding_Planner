import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

const actions = [
  { label: 'New Event', to: '/app/events/new' },
  { label: 'Add Participant', to: '/app/events' },
  { label: 'Add Outfit', to: '/app/events' },
  { label: 'Open Shopping Planner', to: '/app/events' },
];

export function QuickActions() {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Quick actions</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            className="flex min-h-11 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium transition hover:bg-slate-200"
            to={action.to}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
