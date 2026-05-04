import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes";
import { PublicRoutes } from "./publicRoutes";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../layout/AppLayout"; // Importe o layout que criamos

import Login from "../pages/Login";
import Home from "../pages/Home";
import PublicTest from "../pages/PublicTest";
import Register from "@/pages/Register";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teste" element={<PublicTest />} />
      </Route>

      <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
