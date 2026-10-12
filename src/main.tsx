import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HoursPage } from './pages/Hours/HoursPage.tsx';
import { AuthProvider } from './features/auth/AuthProvider.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/Login/LoginPage.tsx';
import { ProtectedRoutes } from './features/auth/ProtectedRoutes.tsx';
import { Layout } from './pages/Layout/Layout.tsx';
import { SummaryPage } from './pages/Summary/SummaryPage.tsx';
import { NotFoundPage } from './pages/NotFound/NotFoundPage.tsx';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StaffPage } from './pages/Staff/StaffPage.tsx';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <HoursPage /> },
          { path: '/staff', element: <StaffPage /> },
          { path: '/summary', element: <SummaryPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
