"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserDetailModal } from "@/components/Modals/user-detail-modal";
import { User } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";
import {
  SearchBar,
  QuickFilters,
  CheckboxFiltersComponent,
  UserTable,
  ExportSection,
  CheckboxFilters,
} from "@/components/verify-user";

export default function VerifyUserPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const toggleFilter = (key: keyof CheckboxFilters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllFilters = () => {
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
  };

  const clearAllFilters = () => {
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
  };

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.uuid?.toLowerCase().includes(searchLower) ||
        user.id.toString().includes(searchLower);

      // Date range filter
      const userDate = new Date(user.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      const matchesDateRange =
        (!fromDate || userDate >= fromDate) && (!toDate || userDate <= toDate);

      // Diploma verification filters
      const hasDiplomas = user.cv.some((cv) => cv.diplomas?.length > 0);
      const hasDiplomaVerified = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "verified"),
      );
      const hasDiplomaRejected = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "rejected"),
      );
      const hasDiplomaPending = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "pending"),
      );

      const matchesDiplomaFilters =
        (!filters.no_diploma_submitted || !hasDiplomas) &&
        (!filters.diploma_verified || hasDiplomaVerified) &&
        (!filters.diploma_verif_rejected || hasDiplomaRejected) &&
        (!filters.diploma_verif_pending || hasDiplomaPending);

      // Story/CV status filters (placeholder logic - adjust based on actual data structure)
      const hasStory = user.cv.length > 0;
      const matchesStoryFilters =
        (!filters.story_not_uploaded || !hasStory) &&
        (!filters.story_published || hasStory) &&
        (!filters.story_rejected || false) &&
        (!filters.story_pending || false);

      // Identity verification filters
      const matchesIdFilters =
        (!filters.id_not_submitted ||
          user.identity_verification_state === null) &&
        (!filters.id_confirmed ||
          user.identity_verification_state === "verified") &&
        (!filters.id_rejected ||
          user.identity_verification_state === "rejected") &&
        (!filters.id_pending ||
          user.identity_verification_state === "pending");

      // If all filters are false, show all (no filter active)
      const anyFilterActive = Object.values(filters).some((v) => v);
      const matchesCheckboxFilters =
        !anyFilterActive ||
        (matchesDiplomaFilters && matchesStoryFilters && matchesIdFilters);

      return matchesSearch && matchesDateRange && matchesCheckboxFilters;
    });
  }, [mockUsers, searchTerm, dateFrom, dateTo, filters]);

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
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

        <UserTable
          users={filteredUsers}
          copiedId={copiedId}
          onCopyId={handleCopyId}
          onViewDetails={handleViewDetails}
        />
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
