import { useWeddingStore } from '@/store/weddingStore';

export function useWeddingContext() {
  return useWeddingStore((state) => ({
    activeMembership: state.activeMembership,
    activeWedding: state.activeWedding,
    activeWeddingId: state.activeWeddingId,
    error: state.error,
    memberships: state.memberships,
    setActiveWeddingId: state.setActiveWeddingId,
    status: state.status,
    weddings: state.weddings,
  }));
}
