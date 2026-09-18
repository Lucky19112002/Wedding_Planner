import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  return useAuthStore((state) => ({
    profile: state.profile,
    status: state.profileStatus,
    error: state.profileError,
  }));
}
