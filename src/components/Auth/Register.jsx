import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  sanitizeInput,
  validateForm,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validation";
import { ToastContainer, toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import PasswordField from "./PasswordField";
import { Requirement, PasswordRequirements } from "./PasswordRequirements";

const Register = () => {
  const navigate = useNavigate();
  const { requestRegistration, confirmRegistration } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const showPasswordHints = isPasswordFocused || isConfirmPasswordFocused;

  const userChecks = {
    notEmpty: formData.username.length > 0,
    maxLength: formData.username.length <= 16,
    noSpaces: /^\S+$/.test(formData.username || "a"),
  };

  const pwdChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password),
    match:
      formData.password.length > 0 &&
      formData.password === formData.confirmPassword,
  };

  const strengthScore = [
    pwdChecks.length,
    pwdChecks.upper,
    pwdChecks.lower,
    pwdChecks.number,
    pwdChecks.special,
  ].filter(Boolean).length;
  const isFormatValid =
    Object.values(userChecks).every(Boolean) &&
    Object.values(pwdChecks).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name])
      setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setFormErrors({});

    if (formData.email !== formData.confirmEmail) {
      setFormErrors((prev) => ({
        ...prev,
        confirmEmail: "Emails do not match.",
      }));
      return;
    }

    const cleanData = {
      username: sanitizeInput(formData.username),
      email: sanitizeInput(formData.email),
      password: formData.password,
    };

    const { isValid, errors } = validateForm(cleanData, {
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
    });

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await requestRegistration(
        cleanData.username,
        cleanData.email,
        cleanData.password,
      );
      setStep(2);
      toast.success("Confirmation code sent to your email!");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const cleanCode = sanitizeInput(confirmationCode);
    if (!cleanCode) return setApiError("Please enter the code.");

    setIsSubmitting(true);
    try {
      await confirmRegistration(cleanCode);
      toast.success("Registered successfully!", { autoClose: 1500 });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || "Verification failed.");
      setIsSubmitting(false);
    }
  };

  const tooltipStyle = {
    padding: "12px",
    background: "var(--background-color)",
    marginTop: "8px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-center" theme="dark" />
      <h2>{step === 1 ? "Create an Account" : "Verify Your Email"}</h2>

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
        <form onSubmit={handleRequestSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              style={{
                borderColor: formErrors.username ? "var(--danger-color)" : "",
              }}
            />
            {isUsernameFocused && (
              <div style={tooltipStyle}>
                <Requirement
                  met={userChecks.notEmpty && userChecks.maxLength}
                  text="Up to 16 characters"
                />
                <Requirement
                  met={userChecks.noSpaces}
                  text="No spaces allowed"
                />
              </div>
            )}
            {formErrors.username && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                {formErrors.username}
              </span>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{
                borderColor: formErrors.email ? "var(--danger-color)" : "",
              }}
            />
            {formErrors.email && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                {formErrors.email}
              </span>
            )}
          </div>

          <div>
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm Email Address"
              value={formData.confirmEmail}
              onChange={handleChange}
              style={{
                borderColor: formErrors.confirmEmail
                  ? "var(--danger-color)"
                  : "",
              }}
            />
            {formErrors.confirmEmail && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                {formErrors.confirmEmail}
              </span>
            )}
          </div>

          <div>
            <PasswordField
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
          </div>

          <div>
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
            />
            {formErrors.confirmPassword && (
              <span
                style={{
                  color: "var(--danger-color)",
                  fontSize: "0.85em",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                {formErrors.confirmPassword}
              </span>
            )}

            {showPasswordHints && (
              <PasswordRequirements checks={pwdChecks} score={strengthScore} />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormatValid || !formData.email}
            style={{ marginTop: "10px" }}
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
              "Send Confirmation Code"
            )}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleConfirmSubmit}>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "0.9em",
              color: "var(--text-muted)",
            }}
          >
            Enter the code sent to your email.
          </p>
          <input
            type="text"
            placeholder="CODE"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
            style={{
              textAlign: "center",
              letterSpacing: "4px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ flex: 2, backgroundColor: "var(--success-color)" }}
            >
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
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
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
