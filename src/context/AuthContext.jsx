import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiClient, setMemoryAccessToken } from "../api/apiClient";
import { Loader2 } from "lucide-react";

export const EmailConfirmationEnum = {
  REGISTRATION: "registration",
  PASSWORD_RESET: "password reset",
  USERNAME_CHANGE: "username change",
  EMAIL_CHANGE: "email change",
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAdmin = user?.roles?.some((role) => role === "ADMIN") || false;

  // --- THE SILENT BOOT ---
  useEffect(() => {
    const silentBoot = async () => {
      console.log(import.meta.env.VITE_BACKEND_API_URL);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          setToken(newAccessToken);
          setMemoryAccessToken(newAccessToken);

          const userRes = await apiClient.get("/user");
          setUser(userRes.data?.data?.user);
        }
      } catch (err) {
        console.log("No active session found. User needs to log in.");
      } finally {
        setIsInitializing(false);
      }
    };

    silentBoot();
  }, []);

  // --- LOGIN ---
  const login = async (username, password) => {
    try {
      const response = await apiClient.post("/login", { username, password });
      const { accessToken } = response.data.data;

      setToken(accessToken);
      setMemoryAccessToken(accessToken);

      const userRes = await apiClient.get("/user");
      setUser(userRes.data?.data?.user);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // --- REGISTRATION ---
  const requestRegistration = async (username, email, password) => {
    try {
      await apiClient.post("/register-confirmation", {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      throw error;
    }
  };

  const confirmRegistration = async (code) => {
    try {
      await apiClient.post("/register", { confirmationCode: code });
      return true;
    } catch (error) {
      throw error;
    }
  };

  // --- PASSWORD RESET ---
  const requestPasswordReset = async (email) => {
    try {
      await apiClient.post("/password-reset-code", { email });
      return true;
    } catch (error) {
      throw error;
    }
  };

  const confirmPasswordReset = async (confirmationCode, password) => {
    try {
      await apiClient.put("/user-password-reset", {
        confirmationCode,
        password,
      });
      return true;
    } catch (error) {
      throw error;
    }
  };

  // --- PROFILE UPDATES ---
  const requestUserUpdate = async (payload) => {
    try {
      await apiClient.post("/confirmation-code-request", payload);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const confirmUserUpdate = async (confirmationType, confirmationCode) => {
    try {
      const response = await apiClient.put("/user", {
        confirmationType,
        confirmationCode,
      });

      if (response.data?.data?.user) {
        setUser((prev) => ({ ...prev, ...response.data.data.user }));
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error(
        "Backend logout failed, forcing local logout anyway.",
        error,
      );
    } finally {
      setToken(null);
      setUser(null);
      setMemoryAccessToken(null);
      localStorage.removeItem("access-token");

      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        setUser,
        token,
        login,
        logout,
        requestRegistration,
        confirmRegistration,
        requestPasswordReset,
        confirmPasswordReset,
        requestUserUpdate,
        confirmUserUpdate,
      }}
    >
      {isInitializing ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader2
            className="animate-spin"
            size={40}
            style={{
              animation: "spin 1s linear infinite",
              color: "var(--primary-color)",
            }}
          />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
