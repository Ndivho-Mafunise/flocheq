import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const PublicRoutes = ({ children }) => {
  const { isAuthenticated,user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
