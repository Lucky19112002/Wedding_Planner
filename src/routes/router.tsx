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
import { InvitePage } from '@/pages/invite/InvitePage';
import { OutfitCreatePage } from '@/pages/outfits/OutfitCreatePage';
import { OutfitDetailPage } from '@/pages/outfits/OutfitDetailPage';
import { OutfitEditPage } from '@/pages/outfits/OutfitEditPage';
import { PublicHomePage } from '@/pages/PublicHomePage';
import { UsersPage } from '@/pages/users/UsersPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PublicHomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/invite/:token', element: <InvitePage /> },
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
          { path: 'participants/:participantId/outfits/new', element: <OutfitCreatePage /> },
          { path: 'outfits/:id', element: <OutfitDetailPage /> },
          { path: 'outfits/:id/edit', element: <OutfitEditPage /> },
          { path: 'users', element: <UsersPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
