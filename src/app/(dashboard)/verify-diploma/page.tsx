"use client";

import { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { getDiplomas } from "@/services/diploma.service";
import type { DiplomasQueryParams, Diploma } from "@/types/diploma";
import { queryClient } from "@/lib/queryClient";
import {
  SearchBar,
  DiplomaTable,
  DiplomaTableSkeleton,
  DiplomaFilters,
  DiplomaStatusFilters,
  ExportSection,
  Pagination,
} from "@/components/verify-diploma";
import { DiplomaDetailModal } from "@/components/Modals/diploma-detail-modal";

export default function VerifyDiplomaPage() {
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Status filter state (multiple selection)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Diploma type and level filter states
  const [selectedDiplomaType, setSelectedDiplomaType] = useState<number | null>(
    null,
  );
  const [selectedDiplomaLevel, setSelectedDiplomaLevel] = useState<
    number | null
  >(null);

  // Build query params based on filters
  const queryParams = useMemo<DiplomasQueryParams>(() => {
    const params: DiplomasQueryParams = {};

    // Global search (debounced)
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm.trim();
    }

    // Set diploma_status (comma-separated for multiple statuses)
    if (selectedStatuses.length > 0) {
      params.diploma_status = selectedStatuses.join(",");
    }

    // Diploma type filter
    if (selectedDiplomaType) {
      params.diploma_type_id = selectedDiplomaType;
    }

    // Diploma level filter
    if (selectedDiplomaLevel) {
      params.diploma_level_id = selectedDiplomaLevel;
    }

    return params;
  }, [
    debouncedSearchTerm,
    selectedStatuses,
    selectedDiplomaType,
    selectedDiplomaLevel,
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch diploma data from API
  const {
    data: diplomaResponse,
    isLoading,
    error,
  } = useFetch(
    ["diplomas", { ...queryParams, page: currentPage, limit: pageSize }],
    () =>
      getDiplomas({
        ...queryParams,
        page: currentPage,
        limit: pageSize,
      }),
  );

  // Get diplomas array and pagination from response
  const filteredDiplomas = diplomaResponse?.data?.data || [];
  const paginationMeta = diplomaResponse?.data?.meta;

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetails = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
    setIsDetailModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refetch data after approve/reject
    queryClient.invalidateQueries({ queryKey: ["diplomas"] });
  };

  const fetchAllDataForExport = async (): Promise<Diploma[]> => {
    try {
      const response = await getDiplomas({
        ...queryParams,
        paginate: 0, // Fetch all data without pagination
      });
      return response.data.data;
    } catch (error) {
      console.error("[Export] Failed to fetch all data:", error);
      throw error;
    }
  };

  // Check if diploma is pending (for showing approve/reject actions)
  const isPendingDiploma =
    selectedDiploma?.verification_status === "pending" &&
    selectedStatuses.includes("pending");

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md dark:shadow-xl dark:shadow-black/20">
        <div className="bg-muted/30 dark:bg-card/50 space-y-6 border-b border-border p-6 backdrop-blur-sm">
          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Status Checkboxes */}
          <DiplomaStatusFilters
            selectedStatuses={selectedStatuses}
            onStatusChange={(statuses) => {
              setSelectedStatuses(statuses);
              setCurrentPage(1); // Reset to page 1 when filters change
            }}
          />

          {/* Diploma Type & Level Filters */}
          <DiplomaFilters
            selectedDiplomaType={selectedDiplomaType}
            selectedDiplomaLevel={selectedDiplomaLevel}
            onDiplomaTypeChange={(typeId) => {
              setSelectedDiplomaType(typeId);
              setCurrentPage(1);
            }}
            onDiplomaLevelChange={(levelId) => {
              setSelectedDiplomaLevel(levelId);
              setCurrentPage(1);
            }}
          />

          {/* Export Section */}
          <ExportSection
            filteredUsers={filteredDiplomas as any}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            fetchAllData={fetchAllDataForExport as any}
          />
        </div>

        {isLoading ? (
          <DiplomaTableSkeleton />
        ) : (
          <>
            <DiplomaTable
              diplomas={filteredDiplomas}
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

      {/* Diploma Detail Modal */}
      {selectedDiploma && (
        <DiplomaDetailModal
          diploma={selectedDiploma}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setTimeout(() => setSelectedDiploma(null), 300);
          }}
          onSuccess={handleModalSuccess}
          showActions={isPendingDiploma}
        />
      )}
    </div>
  );
}
