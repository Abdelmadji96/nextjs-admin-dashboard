import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  clearAuthData,
} from "./cookies";

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
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          // Attempt to refresh the token
          const response = await axios.post(
            `${API_HOST}/api/${API_VERSION}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data;

          // Update access token
          updateAccessToken(access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearAuthData();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_HOST}/api/${API_VERSION}${endpoint}`;
};

