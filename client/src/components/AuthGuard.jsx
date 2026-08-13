import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Protect Admin Pages
  if (
    (location.pathname === "/admin" ||
      location.pathname === "/all-complaints") &&
    user?.role !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGuard;