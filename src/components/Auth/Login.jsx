import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PasswordField from "./PasswordField";
import AuthSuspendedModal from "./AuthSuspendedModal";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("expired") === "true") {
      setError("Your session has expired. Please log in again.");
    }
    if (queryParams.get("suspended") === "true") {
      setShowSuspendedModal(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message === "Account suspended"
      ) {
        setShowSuspendedModal(true);
      } else {
        setError(
          err.response?.status === 404
            ? "Incorrect username or password"
            : "Login failed",
        );
      }
    }
  };

  return (
    <div className="login-container" style={{ position: "relative" }}>
      <AuthSuspendedModal
        isOpen={showSuspendedModal}
        onClose={() => setShowSuspendedModal(false)}
      />

      <h2>Login</h2>
      {error && (
        <p
          style={{
            color: "var(--danger-color)",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div style={{ marginBottom: "15px" }}>
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        <Link to="/forgot-password">Forgotten Password?</Link>
      </p>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
