import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MainLayout = ({ children }) => {
  // --- NEW: Extract isAdmin from AuthContext ---
  const { logout, isAdmin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    console.log(isAdmin, user);
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <Link
            to="/dashboard"
            style={{
              color: "#ecf0f1",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Diet Tracker
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* --- NEW: Only show this link if the user has the ADMIN role --- */}
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                color: "#f39c12",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/profile"
            style={{
              color: "#ecf0f1",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "var(--danger-color)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
};

export default MainLayout;
