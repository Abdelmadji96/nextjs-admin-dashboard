"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { User, UserTableData } from "@/types/user";
import { mockUsers, transformUserToTableData } from "@/data/mockUsers";

interface UsersTableProps {
  onViewUser?: (user: User) => void;
  onExport?: (format: 'excel' | 'pdf') => void;
  isExporting?: boolean;
  className?: string;
}

export function UsersTable({ onViewUser, onExport, isExporting, className }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "verified" | "pending"
  >("all");
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Transform users to table data
  const tableData: UserTableData[] = useMemo(
    () => mockUsers.map(transformUserToTableData),
    [],
  );

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return tableData.filter((user) => {
      // Search filter (UUID, name, email, phone)
      const searchMatch =
        searchTerm === "" ||
        user.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = (() => {
        switch (filterStatus) {
          case "active":
            return user.isActive;
          case "inactive":
            return !user.isActive;
          case "verified":
            return user.isIdentityVerified;
          case "pending":
            return !user.isIdentityVerified;
          default:
            return true;
        }
      })();

      return searchMatch && statusMatch;
    });
  }, [tableData, searchTerm, filterStatus]);

  const handleCopyUuid = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedUuid(uuid);
      setTimeout(() => setCopiedUuid(null), 2000);
    } catch (err) {
      console.error("Failed to copy UUID: ", err);
    }
  };

  const getStatusBadge = (user: UserTableData) => {
    if (!user.isActive) {
      return (
        <Badge variant="destructive" className="gap-1">
          <UserX className="h-3 w-3" />
          Inactive
        </Badge>
      );
    }
    if (user.isIdentityVerified) {
      return (
        <Badge variant="default" className="bg-success gap-1 text-white">
          <UserCheck className="h-3 w-3" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-warning gap-1 text-white">
        <Calendar className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  const getVerificationBadges = (user: UserTableData) => (
    <div className="flex gap-1">
      <Badge
        variant={user.isEmailVerified ? "default" : "outline"}
        className={cn(
          "text-xs",
          user.isEmailVerified
            ? "bg-success text-white"
            : "text-muted-foreground",
        )}
      >
        <Mail className="mr-1 h-3 w-3" />
        Email
      </Badge>
      <Badge
        variant={user.isIdentityVerified ? "default" : "outline"}
        className={cn(
          "text-xs",
          user.isIdentityVerified
            ? "bg-primary text-white"
            : "text-muted-foreground",
        )}
      >
        <UserCheck className="mr-1 h-3 w-3" />
        ID
      </Badge>
      <Badge
        variant={user.isDiplomaVerified ? "default" : "outline"}
        className={cn(
          "text-xs",
          user.isDiplomaVerified
            ? "bg-chart-6 text-white"
            : "text-muted-foreground",
        )}
      >
        📜 Diploma
      </Badge>
    </div>
  );

  return (
    <div
      className={cn(
        "bg-card border-border rounded-lg border shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="border-border border-b p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-foreground text-xl font-semibold">
              Users Management
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Total: {filteredUsers.length} users • Search by UUID, name, email,
              or phone
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search UUID, name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-border bg-background w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-80"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border-border bg-background rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>

            {/* Export Button */}
            {onExport ? (
              <div className="relative" ref={exportMenuRef}>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {showExportMenu && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          onExport('excel');
                          setShowExportMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Download className="h-4 w-4" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => {
                          onExport('pdf');
                          setShowExportMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Download className="h-4 w-4" />
                        Export as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="outline" className="gap-2" disabled>
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border bg-muted/30 border-b">
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                User
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                UUID
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Contact
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Status
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Verification
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Location
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const originalUser = mockUsers.find((u) => u.id === user.id);
              return (
                <tr
                  key={user.id}
                  className="border-border hover:bg-muted/20 border-b transition-colors"
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-medium">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground text-sm capitalize">
                          {user.user_type}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* UUID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                        {user.uuid.split("-")[0]}...
                      </code>
                      <button
                        onClick={() => handleCopyUuid(user.uuid)}
                        className="hover:bg-muted rounded p-1 transition-colors"
                        title={`Copy full UUID: ${user.uuid}`}
                      >
                        {copiedUuid === user.uuid ? (
                          <Check className="text-success h-3 w-3" />
                        ) : (
                          <Copy className="text-muted-foreground h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="text-muted-foreground h-3 w-3" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground">
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">{getStatusBadge(user)}</td>

                  {/* Verification */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getVerificationBadges(user)}
                      <div className="text-muted-foreground flex gap-1 text-xs">
                        <span>CV: {user.cv_count}</span>
                        <span>•</span>
                        <span>Exp: {user.experience_count}</span>
                        <span>•</span>
                        <span>Diploma: {user.diploma_count}</span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {user.city}, {user.nationality}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => originalUser && onViewUser?.(originalUser)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <UserX className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-medium">
              No users found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No users match the selected filters"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredUsers.length > 0 && (
        <div className="border-border bg-muted/20 border-t px-6 py-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground text-sm">
              Showing {filteredUsers.length} of {tableData.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
