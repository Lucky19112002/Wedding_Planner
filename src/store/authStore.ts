import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { getProfile } from '@/services/profile.service';
import type { Profile } from '@/types/domain';

type AuthStore = {
  session: Session | null;
  profile: Profile | null;
  profileStatus: 'idle' | 'loading' | 'ready' | 'error';
  profileError: string | null;
  setSession: (session: Session | null) => void;
  loadProfile: (userId: string) => Promise<void>;
  clearAuthData: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  profile: null,
  profileStatus: 'idle',
  profileError: null,
  setSession: (session) => set({ session }),
  loadProfile: async (userId) => {
    set({ profileStatus: 'loading', profileError: null });
    try {
      const profile = await getProfile(userId);
      set({ profile, profileStatus: 'ready' });
    } catch (error) {
      set({
        profile: null,
        profileStatus: 'error',
        profileError: error instanceof Error ? error.message : 'Profile could not be loaded.',
      });
    }
  },
  clearAuthData: () =>
    set({
      session: null,
      profile: null,
      profileStatus: 'idle',
      profileError: null,
    }),
}));
