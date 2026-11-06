import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { Loading } from '../../components/Loading';

export const ProtectedRoutes = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
