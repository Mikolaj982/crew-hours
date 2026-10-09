import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/useAuth';

export const ProtectedRoutes = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
