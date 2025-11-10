/**
 * Identity Verification API Types
 * 
 * These types represent the structure of identity verification data from the API.
 */

export interface DiplomaStats {
  unverified: number;
  verified: number;
  pending: number;
  canceled: number;
  total: number;
}

export interface IdentityStats {
  diplomas: DiplomaStats;
}

export interface IdentityCV {
  id: number;
  status: "draft" | "published" | "pending" | "canceled" | "none";
  cv_update_count: number;
  last_published_at: string | null;
  seen_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CandidateIdentity {
  id: number;
  reference: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  identity_verification_state: "unverified" | "verified" | "pending" | "canceled";
  completed_identity_at: string | null;
  completed_registration_at: string | null;
  completed_verification_at: string | null;
  show_avatar: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email_verified_at: string | null;
  // Optional fields that may not be in identity response but needed for compatibility
  cv?: IdentityCV | null;
  stats?: IdentityStats;
}

export interface IdentityPaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: Array<[string, string]>;
}

export interface IdentityPaginationLinks {
  current: string;
  next?: string;
  previous?: string;
  first?: string;
  last?: string;
}

export interface IdentityData {
  data: CandidateIdentity[];
  meta?: IdentityPaginationMeta;
  links?: IdentityPaginationLinks;
}

export interface IdentityQueryParams {
  page?: number;
  limit?: number;
  paginate?: number; // Set to 0 to fetch all data without pagination
  search?: string;
  identity_status?: string;
  from_date?: string;
  to_date?: string;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export type IdentityResponse = ApiResponse<IdentityData>;

