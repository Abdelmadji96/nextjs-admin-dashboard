import apiClient from "@/lib/api";
import type {
  Candidate,
  CandidatesQueryParams,
  CandidatesResponse,
} from "@/types/candidate";

// Re-export types for convenience
export type {
  Candidate,
  CandidateCV,
  CandidateStats,
  DiplomaStats,
  CandidatesQueryParams,
  CandidatesResponse,
  CandidatesData,
  PaginationMeta,
  PaginationLinks,
} from "@/types/candidate";

export const getCandidates = async (
  params?: CandidatesQueryParams,
): Promise<CandidatesResponse> => {
  const defaultParams: CandidatesQueryParams = {
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

  const response = await apiClient.get<CandidatesResponse>("/candidates", {
    params: cleanParams,
  });

  return response.data;
};
