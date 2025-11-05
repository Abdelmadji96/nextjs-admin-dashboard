import apiClient from "@/lib/api";
import { saveAuthData, clearAuthData, updateAccessToken, getRefreshToken } from "@/lib/cookies";
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from "@/types/auth";

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials: LoginRequest): Promise<any> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
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

  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    { refresh_token } as RefreshTokenRequest
  );

  // Update access token in cookies
  updateAccessToken(response.data.access_token);

  return response.data;
};

/**
 * Logout user
 * Clears all auth data and redirects to login
 */
export const logout = (): void => {
  // Clear all auth cookies
  clearAuthData();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
