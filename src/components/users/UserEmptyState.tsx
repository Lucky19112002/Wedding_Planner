import { EmptyState } from '@/components/ui/EmptyState';

type UserEmptyStateProps = {
  hasFilters: boolean;
};

export function UserEmptyState({ hasFilters }: UserEmptyStateProps) {
  return (
    <EmptyState
      title={hasFilters ? 'No users match this view' : 'No users yet'}
      description={
        hasFilters
          ? 'Try a different search term, role, or status filter.'
          : 'Invite family members and assign their wedding permissions.'
      }
    />
  );
}
