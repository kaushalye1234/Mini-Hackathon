import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({
  allowedRoles,
  unauthenticatedTo = "/login",
  unauthorizedTo = "/profile"
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-message">Loading account...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={unauthenticatedTo} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
