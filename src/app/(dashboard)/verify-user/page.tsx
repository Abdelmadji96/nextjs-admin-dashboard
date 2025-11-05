"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserDetailModal } from "@/components/Modals/user-detail-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";
import {
  Users,
  UserCheck,
  Shield,
  FileText,
  Download,
  FileSpreadsheet,
  FileText as FilePdf,
  Search,
  Eye,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserX,
  Filter,
} from "lucide-react";
import { exportUsers } from "@/utils/exportUtils";
import { cn } from "@/lib/utils";

type FilterStatus =
  | "all"
  | "no_diploma_submitted"
  | "diploma_verified"
  | "diploma_verif_rejected"
  | "diploma_verif_pending"
  | "story_not_uploaded"
  | "story_published"
  | "story_rejected"
  | "story_pending"
  | "id_confirmed"
  | "id_rejected"
  | "id_pending"
  | "id_not_submitted";

interface CheckboxFilters {
  no_diploma_submitted: boolean;
  diploma_verified: boolean;
  diploma_verif_rejected: boolean;
  diploma_verif_pending: boolean;
  story_not_uploaded: boolean;
  story_published: boolean;
  story_rejected: boolean;
  story_pending: boolean;
  id_confirmed: boolean;
  id_rejected: boolean;
  id_pending: boolean;
  id_not_submitted: boolean;
}

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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleCopyId = async (id: number) => {
    try {
      await navigator.clipboard.writeText(id.toString());
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy ID: ", err);
    }
  };

  // Filter logic
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // If no filters selected, show all
      const anyFilterActive = Object.values(filters).some((v) => v);
      if (!anyFilterActive && !searchTerm && !dateFrom && !dateTo) {
        return true;
      }

      // Search filter
      const searchMatch =
        searchTerm === "" ||
        user.id.toString().includes(searchTerm) ||
        user.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Date filter
      if (dateFrom || dateTo) {
        const userDate = new Date(user.created_at);
        if (dateFrom && userDate < new Date(dateFrom)) return false;
        if (dateTo && userDate > new Date(dateTo)) return false;
      }

      // Status filters
      if (!anyFilterActive) return true;

      // Check diploma filters - using CV diplomas as proxy
      const hasDiplomas = user.cv.some(
        (cv) => cv.diplomas && cv.diplomas.length > 0,
      );
      const diplomaVerified = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "verified"),
      );
      const diplomaRejected = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "rejected"),
      );
      const diplomaPending = user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "pending"),
      );

      if (filters.diploma_verified && diplomaVerified) return true;
      if (filters.diploma_verif_rejected && diplomaRejected) return true;
      if (filters.diploma_verif_pending && diplomaPending) return true;
      if (filters.no_diploma_submitted && !hasDiplomas) return true;

      // Identity verification filters
      if (
        filters.id_confirmed &&
        user.identity_verification_state === "verified"
      )
        return true;
      if (
        filters.id_rejected &&
        user.identity_verification_state === "rejected"
      )
        return true;
      if (filters.id_pending && user.identity_verification_state === "pending")
        return true;
      if (filters.id_not_submitted && !user.identity_verification_state)
        return true;

      // Story filters (using cv as proxy)
      const hasPublishedCV = user.cv.some((cv) => cv.state === "published");
      const hasPendingCV = user.cv.some((cv) => cv.state === "pending");

      if (filters.story_published && hasPublishedCV) return true;
      if (filters.story_not_uploaded && user.cv.length === 0) return true;
      if (filters.story_pending && hasPendingCV) return true;
      if (
        filters.story_rejected &&
        user.cv.some((cv) => cv.state === "rejected")
      )
        return true;

      return false;
    });
  }, [mockUsers, filters, searchTerm, dateFrom, dateTo]);

  const handleExport = async (format: "excel" | "pdf") => {
    setIsExporting(true);
    try {
      const success = await exportUsers(
        filteredUsers,
        format,
        "users_verification_report",
      );
      if (success) {
        console.log(
          `Successfully exported ${filteredUsers.length} users to ${format.toUpperCase()}`,
        );
      } else {
        console.error(`Failed to export to ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.identity_verification_state === "verified") {
      return (
        <Badge variant="default" className="gap-1 bg-success text-white">
          <UserCheck className="h-3 w-3" />
          Verified
        </Badge>
      );
    }
    if (user.identity_verification_state === "rejected") {
      return (
        <Badge variant="destructive" className="gap-1">
          <UserX className="h-3 w-3" />
          Rejected
        </Badge>
      );
    }
    if (user.identity_verification_state === "pending") {
      return (
        <Badge variant="secondary" className="gap-1 bg-warning text-white">
          <Calendar className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        Not Submitted
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header with Sorted By and Search */}
        <div className="border-b border-border p-6">
          <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Sorted By:</Typography>
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID, name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            {/* SELECT ALL Button and Quick Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllFilters}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                SELECT ALL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                Clear All
              </Button>

              {/* CVP Checkbox */}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
                <Checkbox
                  checked={cvpFilter}
                  onCheckedChange={(checked) => setCvpFilter(checked as boolean)}
                />
                <Typography variant="label" className="text-sm">
                  CVP
                </Typography>
              </label>

              {/* 0CV Checkbox */}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
                <Checkbox
                  checked={zeroCvFilter}
                  onCheckedChange={(checked) => setZeroCvFilter(checked as boolean)}
                />
                <Typography variant="label" className="text-sm">
                  0CV
                </Typography>
              </label>

              {/* 1 draft Checkbox */}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
                <Checkbox
                  checked={oneDraftFilter}
                  onCheckedChange={(checked) => setOneDraftFilter(checked as boolean)}
                />
                <Typography variant="label" className="text-sm">
                  1 draft
                </Typography>
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="ml-auto gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Checkbox Filters */}
            {showFilters && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
                  {/* Diploma Verification */}
                  <div className="space-y-2">
                    <Typography variant="label" className="mb-2 text-sm">
                      Diploma Verification
                    </Typography>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={filters.no_diploma_submitted}
                      onCheckedChange={() => toggleFilter("no_diploma_submitted")}
                    />
                    <Typography variant="bodySmall" className="text-muted-foreground">
                      No Diploma Submitted
                    </Typography>
                  </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.diploma_verified}
                        onCheckedChange={() => toggleFilter("diploma_verified")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Diploma Verified
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.diploma_verif_rejected}
                        onCheckedChange={() => toggleFilter("diploma_verif_rejected")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Diploma Verif Rejected
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.diploma_verif_pending}
                        onCheckedChange={() => toggleFilter("diploma_verif_pending")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Diploma Verif Pending
                      </Typography>
                    </label>
                  </div>

                  {/* Story/CV Status */}
                  <div className="space-y-2">
                    <Typography variant="label" className="mb-2 text-sm">
                      Story Status
                    </Typography>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.story_not_uploaded}
                        onCheckedChange={() => toggleFilter("story_not_uploaded")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Story Not Uploaded
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.story_published}
                        onCheckedChange={() => toggleFilter("story_published")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Story Published
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.story_rejected}
                        onCheckedChange={() => toggleFilter("story_rejected")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Story Rejected
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.story_pending}
                        onCheckedChange={() => toggleFilter("story_pending")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        Story Pending
                      </Typography>
                    </label>
                  </div>

                  {/* Identity Verification */}
                  <div className="space-y-2">
                    <Typography variant="label" className="mb-2 text-sm">
                      Identity Verification
                    </Typography>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.id_not_submitted}
                        onCheckedChange={() => toggleFilter("id_not_submitted")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        ID Not Submitted
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.id_confirmed}
                        onCheckedChange={() => toggleFilter("id_confirmed")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        ID Confirmed
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.id_rejected}
                        onCheckedChange={() => toggleFilter("id_rejected")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        ID Rejected
                      </Typography>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={filters.id_pending}
                        onCheckedChange={() => toggleFilter("id_pending")}
                      />
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        ID Pending
                      </Typography>
                    </label>
                  </div>
                </div>

                {/* Date Range - One Line at Bottom */}
                <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
                  <Typography variant="label" className="text-sm">
                    Date Range:
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Typography variant="caption">From:</Typography>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      inputSize="sm"
                      className="w-40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="caption">To:</Typography>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      inputSize="sm"
                      className="w-40"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              {filteredUsers.length} users found
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport("pdf")}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FilePdf className="h-4 w-4" />
                PDF
              </Button>
              <Button
                onClick={() => handleExport("excel")}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                XCL
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  ID Verif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Diploma Verif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/20 border-b border-border transition-colors"
                >
                  {/* ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                        {user.id}
                      </code>
                      <button
                        onClick={() => handleCopyId(user.id)}
                        className="rounded p-1 transition-colors hover:bg-muted"
                        title={`Copy ID: ${user.id}`}
                      >
                        {copiedId === user.id ? (
                          <Check className="h-3 w-3 text-success" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Full Name */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">{getStatusBadge(user)}</td>

                  {/* ID Verif */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {user.identity_verification_state === "verified"
                        ? "✓"
                        : user.identity_verification_state === "pending"
                          ? "⏳"
                          : user.identity_verification_state === "rejected"
                            ? "✗"
                            : "-"}
                    </span>
                  </td>

                  {/* Diploma Verif */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {user.cv.some((cv) =>
                        cv.diplomas?.some(
                          (d) => d.verification_status === "verified",
                        ),
                      )
                        ? "✓"
                        : user.cv.some((cv) =>
                              cv.diplomas?.some(
                                (d) => d.verification_status === "pending",
                              ),
                            )
                          ? "⏳"
                          : user.cv.some((cv) =>
                                cv.diplomas?.some(
                                  (d) => d.verification_status === "rejected",
                                ),
                              )
                            ? "✗"
                            : "-"}
                    </span>
                  </td>

                  {/* Organization */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {user.cv.reduce(
                        (total, cv) => total + (cv.experiences?.length || 0),
                        0,
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewUser(user)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <UserX className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium text-foreground">
                No users found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || Object.values(filters).some((v) => v)
                  ? "Try adjusting your search or filters"
                  : "No users available"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}
