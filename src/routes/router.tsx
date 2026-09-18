import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppHomePage } from '@/pages/AppHomePage';
import { EventCreatePage } from '@/pages/events/EventCreatePage';
import { EventDetailPage } from '@/pages/events/EventDetailPage';
import { EventEditPage } from '@/pages/events/EventEditPage';
import { EventsPage } from '@/pages/events/EventsPage';
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
        children: [
          { index: true, element: <AppHomePage /> },
          { path: 'events', element: <EventsPage /> },
          { path: 'events/new', element: <EventCreatePage /> },
          { path: 'events/:id', element: <EventDetailPage /> },
          { path: 'events/:id/edit', element: <EventEditPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
