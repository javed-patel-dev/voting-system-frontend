import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { token, decodedToken } = useSelector((state: RootState) => state.auth);

    if (!token || !decodedToken) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(decodedToken.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
