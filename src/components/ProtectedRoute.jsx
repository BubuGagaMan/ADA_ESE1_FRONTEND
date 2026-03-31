// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // If they have NO token, bounce them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
