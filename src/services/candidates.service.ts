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

/**
 * Fetches paginated list of candidates with optional filters
 * 
 * @param params - Query parameters for filtering, pagination, and sorting
 * @returns Promise<CandidatesResponse> - API response with candidates data
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const candidates = await getCandidates({ page: 1, limit: 10 });
 * 
 * // Global search across ID, name, and email
 * const searchResults = await getCandidates({
 *   id: "searchTerm",
 *   first_name: "searchTerm",
 *   last_name: "searchTerm",
 *   email: "searchTerm",
 *   page: 1,
 *   limit: 10
 * });
 * 
 * // With filters
 * const filteredCandidates = await getCandidates({
 *   identity_status: "verified,pending",
 *   cv_status: "published",
 *   from_date: "2025-01-01",
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export const getCandidates = async (
  params?: CandidatesQueryParams
): Promise<CandidatesResponse> => {
  // Default parameters
  const defaultParams: CandidatesQueryParams = {
    page: 1,
    limit: 10,
    sortBy: "created_at:DESC",
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
    {} as Record<string, string | number>
  );

  const response = await apiClient.get<CandidatesResponse>("/candidates", {
    params: cleanParams,
  });

  return response.data;
};
