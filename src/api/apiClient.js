import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
3;

let memoryAccessToken = null;

export const setMemoryAccessToken = (token) => {
  memoryAccessToken = token;
};

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config) => {
    // If we have a token in memory, attach it!
    if (memoryAccessToken) {
      config.headers["access-token"] = memoryAccessToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Account suspended"
    ) {
      setMemoryAccessToken(null); // Wipe memory
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?suspended=true";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (newAccessToken) {
          setMemoryAccessToken(newAccessToken);
          originalRequest.headers["access-token"] = newAccessToken;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // if the refresh cookie is expired/missing, kick to login
        setMemoryAccessToken(null);
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?expired=true";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
