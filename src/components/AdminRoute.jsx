import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {

  const {
    loading,
    isAuthenticated,
    user
  } = useSelector((state) => state.user);

  // Wait until loadUser() finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />

          <p className="text-sm font-semibold text-slate-600">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  console.log("ADMIN ROUTE:", {
    user,
    isAuthenticated,
    role: user?.role
  });

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin check
  const role = user?.role?.toString().trim().toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;