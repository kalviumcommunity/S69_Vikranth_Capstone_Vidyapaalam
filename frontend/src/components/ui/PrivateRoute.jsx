import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function PrivateRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to not-authorized page if user's role doesn't match required roles
    return <Navigate to="/not-authorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
}