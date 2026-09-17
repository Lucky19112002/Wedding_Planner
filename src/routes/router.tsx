import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppHomePage } from '@/pages/AppHomePage';
import { LoginPage } from '@/pages/LoginPage';
import { PublicHomePage } from '@/pages/PublicHomePage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PublicHomePage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [{ index: true, element: <AppHomePage /> }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
