import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
} from "../../utils/validation";
import { ToastContainer, toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import PasswordField from "./PasswordField";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, confirmPasswordReset } =
    useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [confirmationCode, setConfirmationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setApiError(null);
    setEmailError(null);

    const cleanEmail = sanitizeInput(email);
    const err = validateEmail(cleanEmail);
    if (err) {
      setEmailError(err);
      return;
    }

    setIsSubmitting(true);
    try {
      await requestPasswordReset(cleanEmail);
      setStep(2);
      toast.success("If an account exists, a reset code has been sent.");
    } catch (err) {
      setApiError("Failed to request reset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setApiError(null);
    setPasswordErrors({});

    const cleanCode = sanitizeInput(confirmationCode);
    if (!cleanCode) {
      setApiError("Please enter the confirmation code.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordErrors({ confirm: "Passwords do not match." });
      return;
    }

    const passErr = validatePassword(newPassword);
    if (passErr) {
      setPasswordErrors({ new: passErr });
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(cleanCode, newPassword);
      toast.success("Password reset successfully! Redirecting to login...", {
        autoClose: 1500,
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Failed to reset password. Code may be invalid or expired.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" theme="dark" />
      <h2>Reset Password</h2>

      {apiError && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            color: "var(--danger-color)",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "0.9em",
          }}
        >
          {apiError}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleRequestReset}>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "0.9em",
              color: "var(--text-muted)",
            }}
          >
            Enter your email address and we will send you a code to reset your
            password.
          </p>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              style={{ borderColor: emailError ? "var(--danger-color)" : "" }}
            />
            {emailError && (
              <span
                style={{ color: "var(--danger-color)", fontSize: "0.85em" }}
              >
                {emailError}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: "10px" }}
          >
            {isSubmitting ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleConfirmReset}>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "0.9em",
              color: "var(--text-muted)",
            }}
          >
            Check your email for the confirmation code and enter your new
            password below.
          </p>

          <div>
            <input
              type="text"
              placeholder="ENTER RESET CODE"
              value={confirmationCode}
              onChange={(e) =>
                setConfirmationCode(e.target.value.toUpperCase())
              }
              style={{
                textAlign: "center",
                letterSpacing: "4px",
                fontSize: "1.2em",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            />
          </div>

          <div>
            <PasswordField
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrors({});
              }}
              error={passwordErrors.new}
            />
            {passwordErrors.new && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {passwordErrors.new}
              </span>
            )}
          </div>

          <div>
            <PasswordField
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                setPasswordErrors({});
              }}
              error={passwordErrors.confirm}
            />
            {passwordErrors.confirm && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {passwordErrors.confirm}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ flex: 2, backgroundColor: "var(--success-color)" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                      marginRight: "8px",
                    }}
                  />{" "}
                  Sending...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setStep(1);
                setApiError(null);
              }}
              style={{
                flex: 1,
                backgroundColor: "var(--surface-hover)",
                color: "var(--text-main)",
              }}
            >
              Back
            </button>
          </div>
        </form>
      )}

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Remembered your password? <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
