import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { AppLayout } from '@/layouts/AppLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function page(load: () => Promise<{ default: ComponentType }>) {
  const Page = lazy(load);
  return (
    <Suspense fallback={<Loader label="Loading page" />}>
      <Page />
    </Suspense>
  );
}

const routes = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: page(() => import('@/pages/PublicHomePage').then((module) => ({ default: module.PublicHomePage }))),
      },
      {
        path: '/login',
        element: page(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage }))),
      },
      {
        path: '/invite/:token',
        element: page(() => import('@/pages/invite/InvitePage').then((module) => ({ default: module.InvitePage }))),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: page(() => import('@/pages/AppHomePage').then((module) => ({ default: module.AppHomePage }))),
          },
          {
            path: 'events',
            element: page(() => import('@/pages/events/EventsPage').then((module) => ({ default: module.EventsPage }))),
          },
          {
            path: 'events/new',
            element: page(() =>
              import('@/pages/events/EventCreatePage').then((module) => ({ default: module.EventCreatePage })),
            ),
          },
          {
            path: 'events/:id',
            element: page(() =>
              import('@/pages/events/EventDetailPage').then((module) => ({ default: module.EventDetailPage })),
            ),
          },
          {
            path: 'events/:id/edit',
            element: page(() =>
              import('@/pages/events/EventEditPage').then((module) => ({ default: module.EventEditPage })),
            ),
          },
          {
            path: 'participants/:participantId/outfits/new',
            element: page(() =>
              import('@/pages/outfits/OutfitCreatePage').then((module) => ({ default: module.OutfitCreatePage })),
            ),
          },
          {
            path: 'outfits/:id',
            element: page(() =>
              import('@/pages/outfits/OutfitDetailPage').then((module) => ({ default: module.OutfitDetailPage })),
            ),
          },
          {
            path: 'outfits/:id/edit',
            element: page(() =>
              import('@/pages/outfits/OutfitEditPage').then((module) => ({ default: module.OutfitEditPage })),
            ),
          },
          {
            path: 'users',
            element: page(() => import('@/pages/users/UsersPage').then((module) => ({ default: module.UsersPage }))),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
