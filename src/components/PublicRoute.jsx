// src/components/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // Use the spinner we made earlier!

const PublicRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  // 1. Wait for the silent boot to finish checking the HttpOnly cookie
  if (isInitializing) {
    return <LoadingSpinner message="Checking session..." />;
  }

  // 2. If they are already logged in, bounce them to the dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If they are truly logged out, render the Login/Register page
  return children;
};

export default PublicRoute;
