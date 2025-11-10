import apiClient from "@/lib/api";
import type {
  CandidateIdentity,
  IdentityQueryParams,
  IdentityResponse,
} from "@/types/identity";

// Re-export types for convenience
export type {
  CandidateIdentity,
  IdentityQueryParams,
  IdentityResponse,
  IdentityData,
  IdentityPaginationMeta,
  IdentityPaginationLinks,
} from "@/types/identity";

export const getCandidatesIdentity = async (
  params?: IdentityQueryParams,
): Promise<IdentityResponse> => {
  const defaultParams: IdentityQueryParams = {
    page: 1,
    limit: 10,
    ...params,
  };

  // Remove undefined, null, and empty string values
  const cleanParams = Object.entries(defaultParams).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string | number>,
  );

  const response = await apiClient.get<IdentityResponse>(
    "/candidates/identity",
    {
      params: cleanParams,
    },
  );

  return response.data;
};

export const approveIdentity = async (candidateId: number): Promise<any> => {
  const response = await apiClient.patch(
    `/candidates/${candidateId}/identity/approve`,
  );
  return response.data;
};

export const rejectIdentity = async (candidateId: number): Promise<any> => {
  const response = await apiClient.patch(
    `/candidates/${candidateId}/identity/reject`,
  );
  return response.data;
};
