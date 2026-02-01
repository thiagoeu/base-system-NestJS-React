import { Navigate, Outlet } from "react-router-dom";

interface PrivateRoutesProps {
  isAuthenticated: boolean;
}

export function PrivateRoutes({ isAuthenticated }: PrivateRoutesProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
