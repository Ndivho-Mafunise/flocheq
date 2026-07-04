import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";
import AuthLayout from "./Layouts/AuthLayout";

// public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Login from "./pages/public/Login";
import Pricing from "./pages/public/Pricing";
import Register from "./pages/public/Register";
import VerifyCode from "./pages/public/verifyEmail";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/Reset-password";

// protected pages
import Dashboard from "./pages/protected/Dashboard";
import Payments from "./pages/protected/Payments";
import Customers from "./pages/protected/Customers";
import Insights from "./pages/protected/Insights";
import Reports from "./pages/protected/Reports";
import Billing from "./pages/protected/Billing";
import Invoices from "./pages/protected/Invoices";
import Settings from "./pages/protected/Settings";
import Subscriptions from "./pages/protected/Subscriptions";
import PaymentMethods from "./pages/protected/PaymentMethods";

import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoute";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/public/NotFound";

import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        {/* Marketing pages — with Navbar */}
        <Route
          element={
            <PublicRoutes>
              <PublicLayout />
            </PublicRoutes>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Auth pages — full-screen, no Navbar */}
        <Route
          element={
            <PublicRoutes>
              <AuthLayout />
            </PublicRoutes>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
