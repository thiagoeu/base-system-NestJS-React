import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRoutesProps {
  isAuthenticated: boolean;
}

export function PrivateRoutes({ isAuthenticated }: PrivateRoutesProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
