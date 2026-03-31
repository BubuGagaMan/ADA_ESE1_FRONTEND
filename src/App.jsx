import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { apiClient } from "./api/apiClient";

// --- COMPONENTS & PAGES ---
import Profile from "./components/Profile/Profile";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateDietForm from "./components/Diet/CreateDietForm";
import DietView from "./components/Diet/DietView";
import CreateMealForm from "./components/Meal/CreateMealForm";
import UserMetricsForm from "./components/Metrics/UserMetricsForm";
import MainLayout from "./components/Layout/MainLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";

// --- NEW: Import the Spinner ---
import LoadingSpinner from "./components/LoadingSpinner";

const RequireMetrics = ({ children }) => {
  const [hasMetrics, setHasMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkMetrics = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/user-metrics");
      if (response.data?.data?.userMetrics) {
        setHasMetrics(true);
      } else {
        setHasMetrics(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasMetrics(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMetrics();
  }, []);

  if (loading) return <LoadingSpinner message="Loading user data..." />;

  if (hasMetrics === false) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <UserMetricsForm onMetricsAdded={checkMetrics} />
      </div>
    );
  }

  return hasMetrics ? children : null;
};

// --- NEW: Public Route Guard (Bounces logged-in users away from Auth pages) ---
const PublicRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  if (isInitializing) return <LoadingSpinner message="Checking session..." />;
  if (token) return <Navigate to="/dashboard" replace />;

  return children;
};

// --- UPDATED: Standard Protected Route ---
const ProtectedRoute = ({ children }) => {
  const { token, isInitializing } = useContext(AuthContext);

  if (isInitializing) return <LoadingSpinner message="Authenticating..." />;
  if (!token) return <Navigate to="/login" replace />;

  return (
    <MainLayout>
      <RequireMetrics>{children}</RequireMetrics>
    </MainLayout>
  );
};

// --- UPDATED: Admin Route ---
const AdminRoute = ({ children }) => {
  const { token, isAdmin, isInitializing } = useContext(AuthContext);
  console.log(isAdmin);

  if (isInitializing) return <LoadingSpinner message="Authenticating..." />;
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* --- PROTECTED ROUTES --- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-diet"
        element={
          <ProtectedRoute>
            <CreateDietForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diet/:dietId"
        element={
          <ProtectedRoute>
            <DietView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diet/:dietId/create-meal"
        element={
          <ProtectedRoute>
            <CreateMealForm />
          </ProtectedRoute>
        }
      />

      {/* --- ADMIN ROUTE --- */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
