import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/tasks" replace />;
  }

  return <Outlet />;
}
