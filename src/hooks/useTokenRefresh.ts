"use client";

import { useEffect } from "react";
import { initTokenRefresh, stopTokenRefresh } from "@/lib/tokenRefreshManager";
import { getAccessToken } from "@/lib/cookies";

/**
 * Hook to automatically manage token refresh
 * 
 * This hook should be used at the root of your app (e.g., in a layout)
 * to ensure tokens are refreshed automatically before they expire
 */
export const useTokenRefresh = () => {
  useEffect(() => {
    // Check if user is logged in
    const token = getAccessToken();
    
    if (token) {
      console.log("[useTokenRefresh] User is authenticated, initializing token refresh");
      initTokenRefresh();
    } else {
      console.log("[useTokenRefresh] No token found, skipping initialization");
    }

    // Cleanup on unmount
    return () => {
      stopTokenRefresh();
    };
  }, []);
};

