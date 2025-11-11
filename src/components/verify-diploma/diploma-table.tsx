"use client";

import { useState, useMemo } from "react";
import { Badge, Button, Typography } from "@/components/ui";
import type { Diploma } from "@/types/diploma";
import {
  Calendar,
  Check,
  Copy,
  Eye,
  GraduationCap,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortField = "id" | "title" | "candidate" | "date";
type SortDirection = "asc" | "desc" | null;

interface DiplomaTableProps {
  diplomas: Diploma[];
  copiedId: number | null;
  onCopyId: (id: number) => void;
  onViewDetails: (diploma: Diploma) => void;
}

export function DiplomaTable({
  diplomas,
  copiedId,
  onCopyId,
  onViewDetails,
}: DiplomaTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort diplomas based on current sort state
  const sortedDiplomas = useMemo(() => {
    if (!sortField || !sortDirection) {
      return diplomas;
    }

    return [...diplomas].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "id":
          comparison = a.id - b.id;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "candidate":
          const nameA = `${a.cv_version.cv.candidate.first_name} ${a.cv_version.cv.candidate.last_name}`.toLowerCase();
          const nameB = `${b.cv_version.cv.candidate.first_name} ${b.cv_version.cv.candidate.last_name}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case "date":
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          comparison = dateA - dateB;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [diplomas, sortField, sortDirection]);

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-3.5 w-3.5" />;
    }
    return <ArrowDown className="ml-1 h-3.5 w-3.5" />;
  };

  // Get verification status badge
  const getStatusBadge = (status: Diploma["verification_status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success" className="text-xs">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="pending" className="text-xs">
            Pending
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="destructive" className="text-xs">
            Rejected
          </Badge>
        );
      case "unverified":
      default:
        return (
          <Badge className="bg-inherit text-xs text-orange-600">
            Unverified
          </Badge>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b-2 border-border backdrop-blur-sm">
            {/* Sortable: ID */}
            <th
              className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center">
                ID
                {renderSortIcon("id")}
              </div>
            </th>

            {/* Sortable: Diploma Title */}
            <th
              className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center">
                Diploma Title
                {renderSortIcon("title")}
              </div>
            </th>

            {/* Sortable: Candidate */}
            <th
              className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => handleSort("candidate")}
            >
              <div className="flex items-center">
                Candidate
                {renderSortIcon("candidate")}
              </div>
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Institution
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Diploma Level
            </th>

            {/* Sortable: Date */}
            <th
              className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date
                {renderSortIcon("date")}
              </div>
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y">
          {sortedDiplomas.map((diploma) => (
            <tr
              key={diploma.id}
              className="hover:bg-muted/40 group transition-all duration-150 dark:hover:bg-accent/10"
            >
              {/* ID */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="bg-muted/80 ring-border/50 rounded px-2.5 py-1.5 font-mono text-xs font-medium text-foreground ring-1 dark:bg-accent/20 dark:ring-accent/30">
                    {diploma.id}
                  </code>
                  <button
                    onClick={() => onCopyId(diploma.id)}
                    className="rounded p-1.5 transition-all hover:bg-muted dark:hover:bg-accent/30"
                    title={`Copy ID: ${diploma.id}`}
                  >
                    {copiedId === diploma.id ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    )}
                  </button>
                </div>
              </td>

              {/* Diploma Title */}
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground line-clamp-2"
                  >
                    {diploma.title}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    {diploma.reference}
                  </Typography>
                </div>
              </td>

              {/* Candidate */}
              <td className="px-6 py-4">
                <div>
                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground"
                  >
                    {diploma.cv_version.cv.candidate.first_name}{" "}
                    {diploma.cv_version.cv.candidate.last_name}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    {diploma.cv_version.cv.candidate.email}
                  </Typography>
                </div>
              </td>

              {/* Institution */}
              <td className="px-6 py-4">
                <Typography
                  variant="bodySmall"
                  className="max-w-xs text-foreground line-clamp-2"
                >
                  {diploma.institution}
                </Typography>
              </td>

              {/* Diploma Level */}
              <td className="px-6 py-4">
                <Typography variant="bodySmall" className="text-foreground">
                  {diploma.diploma_level.designation}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {diploma.diploma_level.diploma_type.designation}
                </Typography>
              </td>

              {/* Date */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(diploma.created_at).toLocaleDateString()}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">{getStatusBadge(diploma.verification_status)}</td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(diploma)}
                    className="gap-2 text-foreground dark:text-foreground dark:hover:bg-accent/30"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedDiplomas.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          {/* Empty State Icon */}
          <div className="bg-muted/50 mb-6 flex h-24 w-24 items-center justify-center rounded-full dark:bg-accent/10">
            <GraduationCap
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>

          {/* Empty State Text */}
          <Typography variant="h4" className="mb-2 text-foreground">
            No diplomas found
          </Typography>
          <Typography variant="muted" className="max-w-md text-center">
            We couldn't find any diplomas matching your current filters. Try
            adjusting your search criteria or clear all filters to see more
            results.
          </Typography>
        </div>
      )}
    </div>
  );
}

