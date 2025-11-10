"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { IdentityVerificationModal } from "@/components/Modals/identity-verification-modal";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { getCandidatesIdentity } from "@/services/identity.service";
import type { IdentityQueryParams, CandidateIdentity } from "@/types/identity";
import { queryClient } from "@/lib/queryClient";
import {
  SearchBar,
  QuickFilters,
  UserTable,
  UserTableSkeleton,
  ExportSection,
  Pagination,
  CheckboxFilters,
} from "@/components/verify-user";
import { Button, Typography } from "@/components/ui";
import { Candidate } from "@/types/candidate";

export default function VerifyIdentityPage() {
  const [selectedUser, setSelectedUser] = useState<CandidateIdentity | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Tab state: "pending" or "processed"
  const [activeTab, setActiveTab] = useState<"pending" | "processed">(
    "pending",
  );

  // Build query params based on active tab
  const queryParams = useMemo<IdentityQueryParams>(() => {
    const params: IdentityQueryParams = {};

    // Global search (debounced)
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm.trim();
    }

    // Date range
    if (dateFrom) params.from_date = dateFrom;
    if (dateTo) params.to_date = dateTo;

    // Set identity_status based on active tab
    if (activeTab === "pending") {
      params.identity_status = "pending";
    } else {
      params.identity_status = "verified,canceled";
    }

    return params;
  }, [debouncedSearchTerm, dateFrom, dateTo, activeTab]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch identity data from API
  const {
    data: identityResponse,
    isLoading,
    error,
  } = useFetch(
    ["identity", { ...queryParams, page: currentPage, limit: pageSize }],
    () =>
      getCandidatesIdentity({
        ...queryParams,
        page: currentPage,
        limit: pageSize,
      }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    },
  );

  // Get users array and pagination from response
  const filteredUsers = identityResponse?.data?.data || [];
  const paginationMeta = identityResponse?.data?.meta;

  // Reset to page 1 when tab changes
  const handleTabChange = (tab: "pending" | "processed") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetails = (user: CandidateIdentity) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refetch data after approve/reject
    queryClient.invalidateQueries({ queryKey: ["identity"] });
  };

  const fetchAllDataForExport = async (): Promise<CandidateIdentity[]> => {
    try {
      const response = await getCandidatesIdentity({
        ...queryParams,
        paginate: 0, // Fetch all data without pagination
      });
      return response.data.data;
    } catch (error) {
      console.error("[Export] Failed to fetch all data:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => handleTabChange("pending")}
          className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Verifications
        </button>

        <button
          onClick={() => handleTabChange("processed")}
          className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "processed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Processed Verifications
        </button>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md dark:shadow-xl dark:shadow-black/20">
        <div className="bg-muted/30 dark:bg-card/50 border-b border-border p-6 backdrop-blur-sm">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <ExportSection
            filteredUsers={filteredUsers as Candidate[]}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            fetchAllData={fetchAllDataForExport as () => Promise<Candidate[]>}
          />
        </div>

        {isLoading ? (
          <UserTableSkeleton />
        ) : (
          <>
            <UserTable
              users={filteredUsers as Candidate[]}
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

      {/* Identity Verification Modal */}
      {selectedUser && (
        <IdentityVerificationModal
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setTimeout(() => setSelectedUser(null), 300);
          }}
          onSuccess={handleModalSuccess}
          showActions={activeTab === "pending"}
        />
      )}
    </div>
  );
}
