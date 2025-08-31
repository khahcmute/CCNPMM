// src/components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>Loading auth...</div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
