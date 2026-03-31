import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return <LoadingSpinner message="Checking session..." />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
