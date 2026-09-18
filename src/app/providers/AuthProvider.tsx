import { useEffect, useMemo, useState } from 'react';
import { AuthContext, type AuthContextValue } from '@/app/providers/AuthContext';
import { getCurrentSession, signOut } from '@/services/auth.service';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useWeddingStore } from '@/store/weddingStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { clearAuthData, loadProfile, session, setSession } = useAuthStore();
  const { clearWeddingContext, loadWeddingContext } = useWeddingStore();

  useEffect(() => {
    let mounted = true;

    void getCurrentSession().then((currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      isAuthenticated: Boolean(session),
      signOut: async () => {
        await signOut();
        clearAuthData();
        clearWeddingContext();
      },
    }),
    [clearAuthData, clearWeddingContext, isLoading, session],
  );

  useEffect(() => {
    if (!session?.user.id) {
      clearWeddingContext();
      return;
    }

    void loadProfile(session.user.id);
    void loadWeddingContext(session.user.id);
  }, [clearWeddingContext, loadProfile, loadWeddingContext, session?.user.id]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
