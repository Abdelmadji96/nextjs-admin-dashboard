import { useCallback, useMemo } from "react";
import { getUser, getAccessToken, isAuthenticated } from "@/lib/cookies";
import { logout as logoutService } from "@/services/auth.service";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication management
 * Provides current auth state and logout functionality
 * 
 * @returns {AuthState & { logout: () => void }} Authentication state and logout function
 * 
 * @example
 * ```tsx
 * const { user, token, isAuthenticated, logout } = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <LoginPrompt />;
 * }
 * 
 * return (
 *   <div>
 *     <p>Welcome, {user?.name}!</p>
 *     <button onClick={logout}>Logout</button>
 *   </div>
 * );
 * ```
 */
export const useAuth = () => {
  // Get current auth state from cookies
  const user = useMemo(() => getUser(), []);
  const token = useMemo(() => getAccessToken(), []);
  const authenticated = useMemo(() => isAuthenticated(), []);

  // Logout callback
  const logout = useCallback(() => {
    logoutService();
  }, []);

  return {
    user,
    token,
    isAuthenticated: authenticated,
    logout,
  };
};

