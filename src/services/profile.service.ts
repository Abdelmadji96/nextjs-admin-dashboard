import apiClient from "@/lib/api";
import type { ProfileResponse } from "@/types/auth";

/**
 * Get user profile
 * GET /auth/profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>("/auth/profile");
  return response.data;
};

