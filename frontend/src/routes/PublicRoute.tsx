import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const PublicRoutes = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) return null;

  const allowAuthenticatedReset =
    location.pathname.startsWith("/reset-password");

  if (isAuthenticated && user && !allowAuthenticatedReset) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
