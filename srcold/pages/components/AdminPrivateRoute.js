// components/AdminPrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in — redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  return children; // Allow access to protected route
}

export default AdminPrivateRoute;
