/**
 * Diploma Types and Interfaces
 * All TypeScript types for diploma verification features
 */

// Diploma Type (Academic, Professional)
export interface DiplomaType {
  id: number;
  designation: string;
  created_at: string;
  updated_at: string;
}

// Diploma Level (Bac, Licence, Master, etc.)
export interface DiplomaLevel {
  id: number;
  designation: string;
  diploma_type: DiplomaType;
  created_at: string;
  updated_at: string;
}

// Candidate information nested in diploma
export interface DiplomaCandidate {
  reference: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  owner: string | null;
  phone: string;
}

// CV information nested in diploma
export interface DiplomaCV {
  id: number;
  status: "draft" | "published";
  candidate: DiplomaCandidate;
}

// CV Version information
export interface DiplomaCVVersion {
  id: number;
  reference: string;
  version: number;
  cv: DiplomaCV;
}

// Main Diploma interface
export interface Diploma {
  id: number;
  reference: string;
  title: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  modality: "onsite" | "remote" | "hybrid";
  description: string;
  verification_status: "unverified" | "pending" | "verified" | "canceled";
  verified_at: string | null;
  is_current: boolean;
  cv_version: DiplomaCVVersion;
  diploma_level: DiplomaLevel;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Pagination metadata
export interface DiplomaMetadata {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [string, string][];
}

// Pagination links
export interface DiplomaLinks {
  current: string;
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

// API Response structure
export interface DiplomasResponse {
  message: string;
  statusCode: number;
  data: {
    data: Diploma[];
    meta?: DiplomaMetadata;
    links?: DiplomaLinks;
  };
}

// Diploma Types API Response
export interface DiplomaTypesResponse {
  diploma_types: DiplomaType[];
}

// Diploma Levels API Response
export interface DiplomaLevelsResponse {
  diploma_levels: DiplomaLevel[];
}

// Query parameters for fetching diplomas
export interface DiplomasQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  diploma_status?: string; // Can be comma-separated: "pending,verified,canceled,unverified"
  diploma_type_id?: number;
  diploma_level_id?: number;
  paginate?: number; // 0 for no pagination (export all)
}

