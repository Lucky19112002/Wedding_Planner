import { useWeddingStore } from '@/store/weddingStore';

export function useWeddingContext() {
  const activeMembership = useWeddingStore((state) => state.activeMembership);
  const activeWedding = useWeddingStore((state) => state.activeWedding);
  const activeWeddingId = useWeddingStore((state) => state.activeWeddingId);
  const error = useWeddingStore((state) => state.error);
  const memberships = useWeddingStore((state) => state.memberships);
  const setActiveWeddingId = useWeddingStore((state) => state.setActiveWeddingId);
  const status = useWeddingStore((state) => state.status);
  const weddings = useWeddingStore((state) => state.weddings);

  return {
    activeMembership,
    activeWedding,
    activeWeddingId,
    error,
    memberships,
    setActiveWeddingId,
    status,
    weddings,
  };
}
