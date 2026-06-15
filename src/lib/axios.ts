import axios from "axios";
import { isPremiumRoute } from "@/lib/subscription-access";

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
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

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
      localStorage.removeItem("token");
      localStorage.removeItem("currentWorkspaceId");
    }

    if (error.response?.status === 402 && typeof window !== "undefined") {
      const subscriptionStatus =
        error.response.headers?.["x-subscription-status"] ??
        error.response.headers?.["X-Subscription-Status"];

      if (subscriptionStatus === "expired") {
        const currentPath = window.location.pathname;
        const isSubscriptionRoute = currentPath.startsWith("/subscription");

        if (!isSubscriptionRoute && !isPremiumRoute(currentPath)) {
          const redirectUrl = `/subscription/expired?from=${encodeURIComponent(currentPath)}`;
          window.location.assign(redirectUrl);
        }
      }
    }

    return Promise.reject(error);
  }
);
