import apiClient, { setLoggingOut } from "@/lib/api";
import {
  saveAuthData,
  clearAuthData,
  updateAccessToken,
  getRefreshToken,
} from "@/lib/cookies";
import { queryClient } from "@/lib/queryClient";
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
    throw new Error("No refresh token available");
  }

  const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh", {
    refresh_token,
  } as RefreshTokenRequest);

  // Update access token in cookies
  updateAccessToken(response.data.access_token);

  return response.data;
};

/**
 * Logout user
 * Clears all auth data and redirects to login
 */
export const logout = (): void => {
  // Set logging out flag to prevent token refresh attempts
  setLoggingOut(true);

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
