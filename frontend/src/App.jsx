import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Pricing from "./pages/public/Pricing";
import Register from "./pages/public/Register";
import VerifyCode from "./pages/public/verifyEmail";
import Billing from "./pages/protected/Billing";
import Customers from "./pages/protected/Customers";
import Dashboard from "./pages/protected/Dashboard";
import Invoices from "./pages/protected/Invoices";
import PaymentMethods from "./pages/protected/PaymentMethods";
import Payments from "./pages/protected/Payments";
import Settings from "./pages/protected/Settings";
import Subscriptions from "./pages/protected/Subscriptions";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoute";
import { Navigate } from "react-router-dom";

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/pricing" element={<Pricing />} />
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
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
