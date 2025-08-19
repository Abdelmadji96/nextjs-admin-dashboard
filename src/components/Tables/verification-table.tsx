"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Generic verification record interface
interface VerificationRecord {
  id: string;
  submissionDate: string;
  applicantName: string;
  documentType: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
  details?: any; // For additional fields specific to each verification type
}

interface VerificationTableProps {
  title: string;
  records: VerificationRecord[];
  className?: string;
  type?: "identity" | "diploma" | "user" | "support";
  onViewDetails?: (recordId: string) => void;
}

// Status and priority mapping for badges
const getStatusVariant = (status: string) => {
  const variants = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    under_review: "under-review",
  };
  return variants[status as keyof typeof variants] || "default";
};

const getPriorityVariant = (priority: string) => {
  const variants = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
  };
  return variants[priority as keyof typeof variants] || "priority-low";
};

export function VerificationTable({
  title,
  records,
  className,
  type = "support",
  onViewDetails,
}: VerificationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] =
    useState<keyof VerificationRecord>("submissionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  // Filter and sort records
  const filteredRecords = records
    .filter((record) => {
      const matchesSearch =
        record.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || record.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSort = (field: keyof VerificationRecord) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAction = (
    recordId: string,
    action: "approve" | "reject" | "review" | "view",
  ) => {
    // TODO: Implement action handling
    console.log(`Action ${action} for record ${recordId}`);
  };

  return (
    <div
      className={cn("bg-card border-border rounded-lg border p-6", className)}
    >
      <div className="mb-6">
        <h2 className="text-foreground mb-4 text-xl font-semibold">{title}</h2>

        {/* Filters and Search */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-border bg-background text-foreground rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              <th
                className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                onClick={() => handleSort("submissionDate")}
              >
                Date{" "}
                {sortField === "submissionDate" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                onClick={() => handleSort("applicantName")}
              >
                Applicant{" "}
                {sortField === "applicantName" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              {type === "diploma" && (
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Institution
                </th>
              )}
              {type === "user" && (
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  User Type
                </th>
              )}
              {type === "identity" && (
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Verification State
                </th>
              )}
              <th
                className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                onClick={() => handleSort("documentType")}
              >
                {type === "diploma"
                  ? "Diploma Level"
                  : type === "identity"
                    ? "Document Type"
                    : type === "user"
                      ? "Account Type"
                      : "Document Type"}{" "}
                {sortField === "documentType" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-muted-foreground hover:text-foreground cursor-pointer px-4 py-3 text-left font-medium"
                onClick={() => handleSort("priority")}
              >
                Priority{" "}
                {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record) => (
              <tr
                key={record.id}
                className="border-border hover:bg-muted/50 border-b"
              >
                <td className="text-foreground px-4 py-3">
                  {new Date(record.submissionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-foreground font-medium">
                      {record.applicantName}
                    </div>
                    {record.details?.email && (
                      <div className="text-muted-foreground text-sm">
                        {record.details.email}
                      </div>
                    )}
                  </div>
                </td>
                {type === "diploma" && (
                  <td className="text-foreground px-4 py-3">
                    {record.details?.institution || "-"}
                  </td>
                )}
                {type === "user" && (
                  <td className="text-foreground px-4 py-3">
                    {record.details?.user_type || "-"}
                  </td>
                )}
                {type === "identity" && (
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        record.details?.identity_verification_state ===
                          "verified"
                          ? "bg-success/10 text-success"
                          : record.details?.identity_verification_state ===
                              "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {record.details?.identity_verification_state?.toUpperCase() ||
                        "NOT_STARTED"}
                    </span>
                  </td>
                )}
                <td className="text-foreground px-4 py-3">
                  {record.documentType}
                </td>
                                 <td className="px-4 py-3">
                   <Badge variant={getStatusVariant(record.status) as any}>
                     {record.status.replace("_", " ").toUpperCase()}
                   </Badge>
                 </td>
                 <td className="px-4 py-3">
                   <Badge variant={getPriorityVariant(record.priority) as any}>
                     {record.priority.toUpperCase()}
                   </Badge>
                 </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {/* View Details button - always available */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (onViewDetails) {
                          onViewDetails(record.id);
                        } else {
                          handleAction(record.id, "view");
                        }
                      }}
                    >
                      View Details
                    </Button>

                    {record.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="primary-button"
                          onClick={() => handleAction(record.id, "review")}
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAction(record.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(record.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {record.status === "under_review" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAction(record.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(record.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredRecords.length)} of{" "}
            {filteredRecords.length} results
          </div>

          <div className="flex gap-2">
            <Button
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
