import apiClient, { setLoggingOut } from "@/lib/api";
import { saveAuthData, clearAuthData } from "@/lib/cookies";
import { queryClient } from "@/lib/queryClient";
import type { LoginRequest, LoginResponse } from "@/types/auth";

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials: LoginRequest): Promise<any> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  // Save encrypted auth data to cookies (7 days for access token, 30 days for refresh token)
  saveAuthData(response.data);

  console.log("[Auth] ✅ Login successful, tokens saved to cookies");

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
  console.log("[Auth] Logging out...");

  // Set logging out flag to prevent token refresh attempts during logout
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

  // Reset flag after redirect
  setTimeout(() => {
    setLoggingOut(false);
  }, 500);
};
