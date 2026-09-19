import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';
import { router } from '@/routes/router';

export function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppErrorBoundary>
  );
}
