// src/components/ui/PrivateRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx";

// export default function PrivateRoute({ roles }) {
//   const { user, loading } = useAuth();

//   if (loading) return <p>Loading...</p>;
//   if (!user)      return <Navigate to="/" replace />;
//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/not-authorized" replace />;
//   }
//   return <Outlet />;
// }

// src/components/ui/PrivateRoute.jsx
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
    // Not authenticated → redirect to login/home
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    // Authenticated, but role not allowed
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
