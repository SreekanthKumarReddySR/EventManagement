import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <p className="route-message">Checking your account...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/tasks" replace />;
  }

  return <Outlet />;
}
