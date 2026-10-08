import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HoursPage } from './pages/Hours/HoursPage.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/Login/LoginPage.tsx';
import { ProtectedRoutes } from './auth/ProtectedRoutes.tsx';
import { Layout } from './pages/Layout/Layout.tsx';
import { SummaryPage } from './pages/Summary/SummaryPage.tsx';
import { NotFoundPage } from './pages/NotFound/NotFoundPage.tsx';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <HoursPage /> },
          { path: '/summary', element: <SummaryPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
