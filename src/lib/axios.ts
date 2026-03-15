import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token and workspace ID
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add workspace ID header
    const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
    if (currentWorkspaceId) {
      config.headers["X-Workspace-ID"] = currentWorkspaceId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("currentWorkspaceId");
      // You can dispatch a logout action here if needed
    }
    return Promise.reject(error);
  }
);
