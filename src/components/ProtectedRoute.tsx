import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, roleLoading, userRole } = useAuth();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to correct dashboard
    const dashboardMap: Record<string, string> = {
      admin: "/admin-dashboard",
      startup: "/startup-dashboard",
      investor: "/investor-dashboard",
      mentor: "/mentor-dashboard",
      cofounder: "/cofounder-dashboard",
    };
    return <Navigate to={dashboardMap[userRole] || "/"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
