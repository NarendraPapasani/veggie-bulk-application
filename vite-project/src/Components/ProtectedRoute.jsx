import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page if not logged in
    toast.info("Please log in to access this page");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // For admin-only routes, check if user is an admin
  if (adminOnly && !user.isAdmin) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
