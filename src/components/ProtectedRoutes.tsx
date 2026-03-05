import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, decodedToken, isInitialized } = useSelector((state: RootState) => state.auth);

  // Wait for auth initialization to prevent flash redirects
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!token || !decodedToken) {
    return <Navigate to="/login" replace />;
  }

  const userRole = decodedToken.role;
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate home page based on role instead of unauthorized
    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
