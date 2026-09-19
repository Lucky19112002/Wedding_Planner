import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  const profile = useAuthStore((state) => state.profile);
  const status = useAuthStore((state) => state.profileStatus);
  const error = useAuthStore((state) => state.profileError);

  return { error, profile, status };
}
