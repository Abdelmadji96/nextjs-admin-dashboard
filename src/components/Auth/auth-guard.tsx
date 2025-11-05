"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, getAccessToken } from "@/lib/cookies";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side authentication guard component
 * Provides additional client-side verification
 * Note: Primary protection is handled by middleware
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();
    const user = getUser();
    const token = getAccessToken();

    // Check if both token and user exist
    if (!authenticated || !user || !token) {
      router.push("/login");
    }
  }, [router]);

  // Render children immediately to avoid hydration mismatch
  // Middleware already protects the route on server-side
  return <>{children}</>;
}

