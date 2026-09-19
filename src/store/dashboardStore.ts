import { create } from 'zustand';
import { getDashboardData } from '@/services/dashboard.service';
import type { DashboardData } from '@/types/domain';

type DashboardStore = {
  dashboard: DashboardData | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  loadDashboard: (weddingId: string) => Promise<void>;
  refreshDashboard: (weddingId: string) => Promise<void>;
  resetDashboard: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: null,
  error: null,
  loading: false,
  refreshing: false,
  loadDashboard: async (weddingId) => {
    set({ loading: true, error: null });
    try {
      set({ dashboard: await getDashboardData(weddingId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Dashboard could not be loaded.'), loading: false });
    }
  },
  refreshDashboard: async (weddingId) => {
    set({ refreshing: true, error: null });
    try {
      set({ dashboard: await getDashboardData(weddingId), refreshing: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Dashboard could not be refreshed.'), refreshing: false });
    }
  },
  resetDashboard: () => set({ dashboard: null, error: null, loading: false, refreshing: false }),
}));
