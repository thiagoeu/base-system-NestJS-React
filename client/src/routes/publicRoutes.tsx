import { Navigate, Outlet } from "react-router-dom";

interface PublicRoutesProps {
  isAuthenticated: boolean;
}

export function PublicRoutes({ isAuthenticated }: PublicRoutesProps) {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
}
