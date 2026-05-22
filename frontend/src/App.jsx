import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/protected/Dashboard";
import Payments from "./pages/protected/payments";
import Home from "./pages/public/Home";
import { useAuthStore } from "./store/authStore";
import VerifyCode from "./pages/public/verifyEmail";
import { useEffect } from "react";
import { ProtectedRoutes } from "./routes/protectedRoutes";
import PublicLayout from "./Layouts/PublicLayout";
import { PublicRoutes } from "./routes/PublicRoute";

export default function App() {
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log(user);
  console.log(isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PublicRoutes>
              <PublicLayout />
            </PublicRoutes>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
