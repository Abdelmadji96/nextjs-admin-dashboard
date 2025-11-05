import apiClient from "@/lib/api";
import { saveAuthData, clearAuthData } from "@/lib/cookies";
import type { LoginRequest, LoginResponse } from "@/types/auth";

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
