import { Routes, Route } from "react-router-dom";
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
      {/* Rota totalmente pública: Sempre acessível */}
      <Route path="/teste" element={<PublicTest />} />

      {/* Rotas Públicas: Acessíveis se não estiver logado. 
          Se estiver verificando sessão, permitimos o acesso para não travar a UI. */}
      <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Rotas Privadas: Só acessíveis se estiver logado.
          Aqui sim mostramos o loading se a sessão ainda estiver sendo verificada. */}
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
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
