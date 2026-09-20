import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { UnauthorizedState } from '@/components/ui/UnauthorizedState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWeddingContext } from '@/hooks/useWeddingContext';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, status: profileStatus } = useProfile();
  const { activeWedding, status: weddingStatus, weddings } = useWeddingContext();

  if (isLoading) {
    return <Loader label="Checking session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profileStatus === 'idle' || profileStatus === 'loading' || weddingStatus === 'idle' || weddingStatus === 'loading') {
    return <Loader label="Loading workspace" />;
  }

  if (profile?.isDeactivated || (weddingStatus === 'ready' && weddings.length > 0 && !activeWedding)) {
    return <UnauthorizedState />;
  }

  return <Outlet />;
}
