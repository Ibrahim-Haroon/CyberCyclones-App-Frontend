import { Navigate, useLocation } from 'react-router-dom';
import { useAuth} from "../../contexts/auth-context.tsx";
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // You might want to show a loading spinner here
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login page but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}