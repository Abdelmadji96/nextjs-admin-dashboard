"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserDetailModal } from "@/components/Modals/user-detail-modal";
import { useFetch } from "@/hooks/useFetch";
import { getCandidates } from "@/services/candidates.service";
import type { CandidatesQueryParams, Candidate } from "@/types/candidate";
import {
  SearchBar,
  QuickFilters,
  CheckboxFiltersComponent,
  UserTable,
  UserTableSkeleton,
  ExportSection,
  Pagination,
  CheckboxFilters,
} from "@/components/verify-user";

export default function VerifyUserPage() {
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Quick filters state
  const [cvpFilter, setCvpFilter] = useState(false);
  const [zeroCvFilter, setZeroCvFilter] = useState(false);
  const [oneDraftFilter, setOneDraftFilter] = useState(false);

  // Checkbox filters state
  const [filters, setFilters] = useState<CheckboxFilters>({
    no_diploma_submitted: false,
    diploma_verified: false,
    diploma_verif_rejected: false,
    diploma_verif_pending: false,
    story_not_uploaded: false,
    story_published: false,
    story_rejected: false,
    story_pending: false,
    id_confirmed: false,
    id_rejected: false,
    id_pending: false,
    id_not_submitted: false,
  });

  // Build query params based on filters
  const queryParams = useMemo<CandidatesQueryParams>(() => {
    const params: CandidatesQueryParams = {};

    // Global search across id, first_name, last_name, email
    if (searchTerm) {
      const trimmedSearch = searchTerm.trim();
      
      // Send search term to all searchable fields
      // The API will return results that match ANY of these fields
      params.id = trimmedSearch;
      params.first_name = trimmedSearch;
      params.last_name = trimmedSearch;
      params.email = trimmedSearch;
    }

    // Add date range
    if (dateFrom) params.from_date = dateFrom;
    if (dateTo) params.to_date = dateTo;

    // Map checkbox filters to API params (comma-separated for multiple values)
    // Identity status - can have multiple values
    const identityStatuses: string[] = [];
    if (filters.id_confirmed) identityStatuses.push("verified");
    if (filters.id_pending) identityStatuses.push("pending");
    if (filters.id_rejected) identityStatuses.push("canceled");
    if (filters.id_not_submitted) identityStatuses.push("unverified");
    if (identityStatuses.length > 0) {
      params.identity_status = identityStatuses.join(",");
    }

    // Story/CV status - can have multiple values
    // Include both checkbox filters and quick filters (CVP, 0CV, 1 draft)
    const cvStatuses: string[] = [];
    
    // From checkbox filters
    if (filters.story_published) cvStatuses.push("published");
    if (filters.story_pending) cvStatuses.push("pending");
    if (filters.story_rejected) cvStatuses.push("canceled");
    if (filters.story_not_uploaded) cvStatuses.push("draft");
    
    // From quick filters
    if (cvpFilter) cvStatuses.push("published");
    if (zeroCvFilter) cvStatuses.push("none");
    if (oneDraftFilter) cvStatuses.push("draft");
    
    // Remove duplicates and join
    if (cvStatuses.length > 0) {
      const uniqueCvStatuses = [...new Set(cvStatuses)];
      params.cv_status = uniqueCvStatuses.join(",");
    }

    // Diploma status - can have multiple values
    const diplomaStatuses: string[] = [];
    if (filters.diploma_verified) diplomaStatuses.push("verified");
    if (filters.diploma_verif_pending) diplomaStatuses.push("pending");
    if (filters.diploma_verif_rejected) diplomaStatuses.push("canceled");
    if (filters.no_diploma_submitted) diplomaStatuses.push("unverified");
    if (diplomaStatuses.length > 0) {
      params.diploma_status = diplomaStatuses.join(",");
    }

    return params;
  }, [searchTerm, dateFrom, dateTo, filters, cvpFilter, zeroCvFilter, oneDraftFilter]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch candidates from API
  const { data: candidatesResponse, isLoading, error } = useFetch(
    ["candidates", { ...queryParams, page: currentPage, limit: pageSize }],
    () => getCandidates({ ...queryParams, page: currentPage, limit: pageSize }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Get users array and pagination from response
  const filteredUsers = candidatesResponse?.data?.data || [];
  const paginationMeta = candidatesResponse?.data?.meta;

  const toggleFilter = (key: keyof CheckboxFilters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllFilters = () => {
    // Select all checkbox filters
    setFilters({
      no_diploma_submitted: true,
      diploma_verified: true,
      diploma_verif_rejected: true,
      diploma_verif_pending: true,
      story_not_uploaded: true,
      story_published: true,
      story_rejected: true,
      story_pending: true,
      id_confirmed: true,
      id_rejected: true,
      id_pending: true,
      id_not_submitted: true,
    });
    
    // Select all quick CV filters
    setCvpFilter(true);
    setZeroCvFilter(true);
    setOneDraftFilter(true);
  };

  const clearAllFilters = () => {
    // Clear all checkbox filters
    setFilters({
      no_diploma_submitted: false,
      diploma_verified: false,
      diploma_verif_rejected: false,
      diploma_verif_pending: false,
      story_not_uploaded: false,
      story_published: false,
      story_rejected: false,
      story_pending: false,
      id_confirmed: false,
      id_rejected: false,
      id_pending: false,
      id_not_submitted: false,
    });
    
    // Clear all quick CV filters
    setCvpFilter(false);
    setZeroCvFilter(false);
    setOneDraftFilter(false);
  };

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetails = (user: Candidate) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md dark:shadow-xl dark:shadow-black/20">
        <div className="border-b border-border bg-muted/30 p-6 backdrop-blur-sm dark:bg-card/50">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="space-y-4">
            <QuickFilters
              cvpFilter={cvpFilter}
              setCvpFilter={setCvpFilter}
              zeroCvFilter={zeroCvFilter}
              setZeroCvFilter={setZeroCvFilter}
              oneDraftFilter={oneDraftFilter}
              setOneDraftFilter={setOneDraftFilter}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectAllFilters={selectAllFilters}
              clearAllFilters={clearAllFilters}
            />

            {showFilters && (
              <CheckboxFiltersComponent
                filters={filters}
                toggleFilter={toggleFilter}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
              />
            )}
          </div>

          <ExportSection
            filteredUsers={filteredUsers}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
          />
        </div>

        {isLoading ? (
          <UserTableSkeleton />
        ) : (
          <>
            <UserTable
              users={filteredUsers}
              copiedId={copiedId}
              onCopyId={handleCopyId}
              onViewDetails={handleViewDetails}
            />
            {paginationMeta && (
              <Pagination
                meta={paginationMeta}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
