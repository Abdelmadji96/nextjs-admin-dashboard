/**
 * Candidate API Types
 *
 * These types represent the structure of candidate data from the API.
 * Use these types for all candidate-related API responses and data handling.
 */

export interface CandidateCV {
  id: number;
  /** CV status: 'published' (CVP), 'draft' (1 draft), 'pending', 'canceled', 'none' (0CV) */
  status: "draft" | "published" | "pending" | "canceled" | "none";
  cv_update_count: number;
  last_published_at: string | null;
  seen_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DiplomaStats {
  unverified: number;
  verified: number;
  pending: number;
  canceled: number;
  total: number;
}

export interface CandidateStats {
  diplomas: DiplomaStats;
}

export interface Candidate {
  id: number;
  reference: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  identity_verification_state:
    | "unverified"
    | "verified"
    | "pending"
    | "canceled";
  completed_identity_at: string | null;
  completed_registration_at: string | null;
  completed_verification_at: string | null;
  show_avatar: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email_verified_at: string | null;
  cv: CandidateCV | null;
  stats: CandidateStats;
}

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: Array<[string, string]>;
}

export interface PaginationLinks {
  current: string;
  next?: string;
  previous?: string;
  first?: string;
  last?: string;
}

export interface CandidatesData {
  data: Candidate[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface CandidatesQueryParams {
  page?: number;
  limit?: number;
  paginate?: number; // Set to 0 to fetch all data without pagination
  sortBy?: string;
  search?: string;
  reference?: string;
  identity_status?: string;
  from_date?: string;
  to_date?: string;
  cv_status?: string;
  story_status?: string;
  diploma_status?: string;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export type CandidatesResponse = ApiResponse<CandidatesData>;
