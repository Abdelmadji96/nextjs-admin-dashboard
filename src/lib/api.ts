import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  clearAuthData,
  updateAccessToken,
  updateRefreshToken,
} from "./cookies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
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
  console.log(`[API] Logout flag set to: ${value}`);
};

// Token refresh queue management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process all queued requests after token refresh
 */
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip if no config (network error before request)
    if (!originalRequest) {
      console.log("[API] Network error, no config available");
      return Promise.reject(error);
    }

    // Check if we're on login page
    const isOnLoginPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/auth/sign-in");

    // Skip if already on login page
    if (isOnLoginPage) {
      return Promise.reject(error);
    }

    // Skip if logging out
    if (isLoggingOut) {
      console.log("[API] Logout in progress, skipping refresh");
      return Promise.reject(error);
    }

    // Skip refresh endpoint itself
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");
    if (isRefreshEndpoint) {
      console.log("[API] Refresh endpoint failed, clearing auth");
      clearAuthData();
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we have a refresh token
      const refresh_token = getRefreshToken();

      if (!refresh_token) {
        console.log("[API] No refresh token available, redirecting to login");
        clearAuthData();
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log("[API] Token refresh in progress, queuing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark as retrying to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      console.log("[API] Token expired, refreshing...");

      return new Promise((resolve, reject) => {
        // Call refresh token endpoint directly in interceptor
        axios
          .post(`${API_BASE_URL}/api/${API_VERSION}/auth/refresh`, {
            refresh_token,
          })
          .then((response) => {
            const { access_token, refresh_token: new_refresh_token } =
              response.data;

            if (!access_token) {
              throw new Error("No access token in refresh response");
            }

            // Update access token in cookies with extended expiration
            updateAccessToken(access_token);

            // Update refresh token if a new one was provided
            if (new_refresh_token) {
              updateRefreshToken(new_refresh_token);
            }

            // Update authorization header for original request
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            // Resolve all queued requests with new token
            processQueue(null, access_token);

            // Retry the original request
            resolve(apiClient(originalRequest));
          })
          .catch((refreshError) => {
            console.error(
              "[API] ❌ Token refresh failed:",
              refreshError.message,
            );

            // Process queue with error
            processQueue(refreshError, null);

            // Clear auth data
            clearAuthData();

            // Redirect to login
            if (typeof window !== "undefined") {
              console.log("[API] Redirecting to login...");
              window.location.replace("/login");
            }

            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // For other errors, just reject
    return Promise.reject(error);
  },
);

export default apiClient;

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}/api/${API_VERSION}${endpoint}`;
};
