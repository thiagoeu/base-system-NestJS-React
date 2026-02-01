import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes";
import { PublicRoutes } from "./publicRoutes";

import Login from "../pages/Login";

export default function AppRoutes() {
  const isAuthenticated = false;

  return (
    <Routes>
      <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={<PrivateRoutes isAuthenticated={isAuthenticated} />}
      ></Route>
    </Routes>
  );
}
