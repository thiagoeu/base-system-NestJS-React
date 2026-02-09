import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes";
import { PublicRoutes } from "./publicRoutes";
import { useAuth } from "../hooks/useAuth";

import Login from "../pages/Login";
import Home from "../pages/Home";
import PublicTest from "../pages/PublicTest";

export default function AppRoutes() {
  const { isAuthenticated, isLoadingUser, isErrorUser } = useAuth();

  return (
    <Routes>
      <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/teste" element={<PublicTest />} />
      </Route>
      <Route
        element={
          isLoadingUser && !isErrorUser ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontFamily: "sans-serif",
              }}
            >
              <p>Verificando sessão...</p>
            </div>
          ) : (
            <PrivateRoutes isAuthenticated={isAuthenticated} />
          )
        }
      >
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
