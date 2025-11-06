import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, clearAuthData } from "./cookies";
import { refreshToken } from "@/services/auth.service";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_HOST}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Flag to track if logout is in progress
let isLoggingOut = false;

// Function to set logout flag (exported for use in logout)
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh
 * When token is refreshed, all subscribers will be notified
 */
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

/**
 * Notify all subscribers that token has been refreshed
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if logging out or already on login/auth pages
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const isOnLoginPage = typeof window !== "undefined" && 
      (window.location.pathname === "/login" || window.location.pathname === "/auth/sign-in");

    // If token expired (401) and we haven't retried yet, and not logging out
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isLoggingOut && 
      !isAuthEndpoint &&
      !isOnLoginPage
    ) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("[API] Token expired, attempting to refresh...");
        
        // Attempt to refresh the token using auth service
        const { access_token } = await refreshToken();

        console.log("[API] Token refreshed successfully");

        // Notify all queued requests that token is refreshed
        onTokenRefreshed(access_token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[API] Token refresh failed:", refreshError);
        
        // Refresh failed, clear tokens and redirect to login
        clearAuthData();

        if (typeof window !== "undefined") {
          console.log("[API] Redirecting to login...");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_HOST}/api/${API_VERSION}${endpoint}`;
};
