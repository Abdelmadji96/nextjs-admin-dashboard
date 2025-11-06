import { refreshToken } from "@/services/auth.service";
import { getAccessToken } from "./cookies";

/**
 * Token Refresh Manager
 * 
 * Manages automatic token refresh before expiration
 * to provide seamless user experience
 */

let refreshTimer: NodeJS.Timeout | null = null;

/**
 * Decode JWT token to get expiration time
 * Note: This only decodes the token, doesn't verify it
 */
const decodeToken = (token: string): { exp?: number } | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("[TokenManager] Failed to decode token:", error);
    return null;
  }
};

/**
 * Calculate time until token expiration (in milliseconds)
 */
const getTimeUntilExpiration = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;

  return timeUntilExpiration;
};

/**
 * Schedule token refresh before it expires
 * Refreshes 2 minutes before expiration
 */
export const scheduleTokenRefresh = (): void => {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const token = getAccessToken();
  if (!token) {
    console.log("[TokenManager] No token found, skipping refresh schedule");
    return;
  }

  const timeUntilExpiration = getTimeUntilExpiration(token);
  if (!timeUntilExpiration) {
    console.warn("[TokenManager] Could not determine token expiration");
    return;
  }

  // Refresh 2 minutes (120000ms) before expiration
  // If token expires in less than 2 minutes, refresh immediately
  const REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes
  const refreshTime = Math.max(0, timeUntilExpiration - REFRESH_BUFFER);

  console.log(
    `[TokenManager] Token expires in ${Math.round(timeUntilExpiration / 1000 / 60)} minutes. Refresh scheduled in ${Math.round(refreshTime / 1000 / 60)} minutes`,
  );

  refreshTimer = setTimeout(async () => {
    try {
      console.log("[TokenManager] Proactively refreshing token...");
      await refreshToken();
      console.log("[TokenManager] Token refreshed successfully");
      
      // Schedule next refresh
      scheduleTokenRefresh();
    } catch (error) {
      console.error("[TokenManager] Failed to refresh token:", error);
    }
  }, refreshTime);
};

/**
 * Stop automatic token refresh
 */
export const stopTokenRefresh = (): void => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("[TokenManager] Token refresh stopped");
  }
};

/**
 * Initialize token refresh manager
 * Call this after successful login
 */
export const initTokenRefresh = (): void => {
  console.log("[TokenManager] Initializing token refresh manager");
  scheduleTokenRefresh();
};

