import React, { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { EmailConfirmationEnum } from "../../context/AuthContext";
import {
  sanitizeInput,
  validateEmail,
  validateUsername,
  validatePassword,
} from "../../utils/validation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const AccountSettings = ({
  user,
  setUser,
  logout,
  requestUserUpdate,
  confirmUserUpdate,
}) => {
  const [activeUpdate, setActiveUpdate] = useState(null);
  const [updateStep, setUpdateStep] = useState(1);
  const [updateData, setUpdateData] = useState({
    newValue: "",
    confirmValue: "",
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startUpdateFlow = (type) => {
    setActiveUpdate(type);
    setUpdateStep(1);
    setUpdateData({ newValue: "", confirmValue: "" });
    setConfirmationCode("");
    setAccountError(null);
    setShowPassword(false);
  };

  const handleRequestUpdate = async (e) => {
    e.preventDefault();
    setAccountError(null);

    if (activeUpdate === "email" || activeUpdate === "password") {
      if (updateData.newValue !== updateData.confirmValue) {
        setAccountError("Values do not match.");
        return;
      }
    }

    const cleanValue =
      activeUpdate === "password"
        ? updateData.newValue
        : sanitizeInput(updateData.newValue);
    let errorMsg = null;

    if (activeUpdate === "username") errorMsg = validateUsername(cleanValue);
    if (activeUpdate === "email") errorMsg = validateEmail(cleanValue);
    if (activeUpdate === "password") errorMsg = validatePassword(cleanValue);

    if (errorMsg) {
      setAccountError(errorMsg);
      return;
    }

    const payload = {};
    if (activeUpdate === "username") {
      payload.username = cleanValue;
      payload.confirmationType = EmailConfirmationEnum.USERNAME_CHANGE;
    }
    if (activeUpdate === "email") {
      payload.email = cleanValue;
      payload.confirmationType = EmailConfirmationEnum.EMAIL_CHANGE;
    }
    if (activeUpdate === "password") {
      payload.password = cleanValue;
      payload.confirmationType = EmailConfirmationEnum.PASSWORD_RESET;
    }

    setIsSaving(true);
    try {
      await requestUserUpdate(payload);
      setUpdateStep(2);
      toast.info("Confirmation code sent to your email!");
    } catch (err) {
      setAccountError(
        err.response?.data?.message || "Failed to request update.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmUpdate = async (e) => {
    e.preventDefault();
    setAccountError(null);

    const cleanCode = sanitizeInput(confirmationCode);
    if (!cleanCode) {
      setAccountError("Please enter the confirmation code.");
      return;
    }

    let confirmationType = "";
    if (activeUpdate === "username")
      confirmationType = EmailConfirmationEnum.USERNAME_CHANGE;
    if (activeUpdate === "email")
      confirmationType = EmailConfirmationEnum.EMAIL_CHANGE;
    if (activeUpdate === "password")
      confirmationType = EmailConfirmationEnum.PASSWORD_RESET;

    setIsSaving(true);
    try {
      await confirmUserUpdate(confirmationType, cleanCode);
      if (activeUpdate === "username" || activeUpdate === "email") {
        setUser((prev) => ({ ...prev, [activeUpdate]: updateData.newValue }));
      }
      toast.success(
        `${activeUpdate.charAt(0).toUpperCase() + activeUpdate.slice(1)} updated!`,
      );
      setActiveUpdate(null);
    } catch (err) {
      setAccountError(
        err.response?.data?.message || "Invalid or expired code.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirm1 = window.confirm(
      "Are you ABSOLUTELY sure? All data will be lost.",
    );
    if (!confirm1) return;
    const confirm2 = window.prompt("Type 'DELETE' to confirm:");
    if (confirm2 !== "DELETE") return;

    apiClient.delete("/user").catch((err) => console.error(err));
    setTimeout(() => logout(), 500);
  };

  const eyeBtnStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
    color: "var(--text-muted)",
  };

  return (
    <>
      <h2
        style={{
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        Account Settings
      </h2>
      <p style={{ marginBottom: "10px" }}>
        Username: <strong>{user?.username}</strong>
      </p>
      <p style={{ marginBottom: "20px" }}>
        Email: <strong>{user?.email}</strong>
      </p>
      {accountError && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            color: "var(--danger-color)",
          }}
        >
          {accountError}
        </div>
      )}
      {!activeUpdate && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => startUpdateFlow("username")}>
            Change Username
          </button>
          <button onClick={() => startUpdateFlow("email")}>Change Email</button>
          <button onClick={() => startUpdateFlow("password")}>
            Change Password
          </button>
        </div>
      )}
      {activeUpdate && updateStep === 1 && (
        <form
          onSubmit={handleRequestUpdate}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "15px",
            backgroundColor: "var(--background-color)",
            borderRadius: "6px",
          }}
        >
          <h4 style={{ margin: 0, textTransform: "capitalize" }}>
            Change {activeUpdate}
          </h4>

          {activeUpdate === "username" && (
            <input
              type="text"
              placeholder="New Username"
              value={updateData.newValue}
              onChange={(e) =>
                setUpdateData({ ...updateData, newValue: e.target.value })
              }
              required
            />
          )}

          {activeUpdate === "email" && (
            <>
              <input
                type="email"
                placeholder="New Email"
                value={updateData.newValue}
                onChange={(e) =>
                  setUpdateData({ ...updateData, newValue: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Confirm New Email"
                value={updateData.confirmValue}
                onChange={(e) =>
                  setUpdateData({ ...updateData, confirmValue: e.target.value })
                }
                required
              />
            </>
          )}

          {activeUpdate === "password" && (
            <>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={updateData.newValue}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, newValue: e.target.value })
                  }
                  style={{ width: "100%" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeBtnStyle}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={updateData.confirmValue}
                onChange={(e) =>
                  setUpdateData({ ...updateData, confirmValue: e.target.value })
                }
                style={{ width: "100%" }}
                required
              />
            </>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ flex: 1, backgroundColor: "var(--success-color)" }}
            >
              Request Code
            </button>
            <button
              type="button"
              onClick={() => setActiveUpdate(null)}
              style={{
                flex: 1,
                backgroundColor: "var(--surface-hover)",
                color: "var(--text-main)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {activeUpdate && updateStep === 2 && (
        <form
          onSubmit={handleConfirmUpdate}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "15px",
            backgroundColor: "var(--background-color)",
            borderRadius: "6px",
          }}
        >
          <h4 style={{ margin: 0 }}>Confirm Change</h4>
          <input
            type="text"
            placeholder="CODE"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
            style={{
              textAlign: "center",
              letterSpacing: "4px",
              fontWeight: "bold",
            }}
            required
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ flex: 1, backgroundColor: "var(--success-color)" }}
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setUpdateStep(1)}
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
      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <h4 style={{ color: "var(--danger-color)", margin: "0 0 10px 0" }}>
          Danger Zone
        </h4>
        <button
          onClick={handleDeleteAccount}
          style={{ backgroundColor: "var(--danger-color)", width: "100%" }}
        >
          Delete Account
        </button>
      </div>
    </>
  );
};

export default AccountSettings;
