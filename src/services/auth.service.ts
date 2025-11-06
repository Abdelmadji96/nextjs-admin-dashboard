import apiClient, { setLoggingOut } from "@/lib/api";
import {
  saveAuthData,
  clearAuthData,
  updateAccessToken,
  getRefreshToken,
} from "@/lib/cookies";
import { queryClient } from "@/lib/queryClient";
import { initTokenRefresh, stopTokenRefresh } from "@/lib/tokenRefreshManager";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth";

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials: LoginRequest): Promise<any> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  // Save encrypted auth data to cookies
  saveAuthData(response.data);

  // Initialize automatic token refresh
  initTokenRefresh();

  // Return structure compatible with usePost hook
  return {
    ...response.data,
    status: response.status,
    message: "Login successful! Welcome back.",
  };
};

/**
 * Refresh access token using refresh token
 * POST /auth/refresh
 */
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    console.error("[Auth] No refresh token available");
    throw new Error("No refresh token available");
  }

  try {
    console.log("[Auth] Sending refresh token request...");
    
    const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh", {
      refresh_token,
    } as RefreshTokenRequest);

    // Update access token in cookies
    updateAccessToken(response.data.access_token);

    console.log("[Auth] Access token updated successfully");

    return response.data;
  } catch (error: any) {
    console.error("[Auth] Refresh token request failed:", error.response?.data || error.message);
    
    // If refresh token is invalid or expired, clear auth data
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("[Auth] Refresh token expired or invalid, clearing auth data");
      clearAuthData();
    }
    
    throw error;
  }
};

/**
 * Logout user
 * Clears all auth data and redirects to login
 */
export const logout = (): void => {
  // Set logging out flag to prevent token refresh attempts
  setLoggingOut(true);

  // Stop automatic token refresh
  stopTokenRefresh();

  // Cancel all ongoing queries to prevent 401 loops
  queryClient.cancelQueries();

  // Clear React Query cache
  queryClient.clear();

  // Clear all auth cookies
  clearAuthData();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }

  // Reset flag after a short delay (in case redirect takes time)
  setTimeout(() => {
    setLoggingOut(false);
  }, 1000);
};
