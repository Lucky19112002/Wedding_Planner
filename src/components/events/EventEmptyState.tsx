import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function EventEmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <EmptyState
      title={hasFilters ? 'No matching events' : 'No events yet'}
      description={
        hasFilters
          ? 'Try clearing search or choosing a different status.'
          : 'Create the first wedding event to start planning the schedule.'
      }
    >
      {!hasFilters ? (
        <div className="mt-5 hidden sm:block">
          <Button asChild>
            <Link to="/app/events/new">New Event</Link>
          </Button>
        </div>
      ) : null}
    </EmptyState>
  );
}
