"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UsersTable } from "@/components/Tables/users-table";
import { UserDetailModal } from "@/components/Modals/user-detail-modal";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { exportUsers } from "@/utils/exportUtils";

export default function VerifyUserPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleExport = async (format: "excel" | "pdf") => {
    setIsExporting(true);
    try {
      const success = await exportUsers(
        mockUsers,
        format,
        "users_verification_report",
      );
      if (success) {
        // You could add a toast notification here
        console.log(
          `Successfully exported ${mockUsers.length} users to ${format.toUpperCase()}`,
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

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Verify User" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-foreground mb-2 flex items-center gap-3 text-2xl font-bold">
              <Users className="h-8 w-8 text-primary" />
              User Verification
            </h1>
            <p className="text-muted-foreground">
              Review and verify user profiles with comprehensive verification
              status and detailed information.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => handleExport("excel")}
              disabled={isExporting}
              variant="outline"
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              variant="outline"
              className="gap-2"
            >
              <FilePdf className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {mockUsers.length}
                </p>
                <p className="text-muted-foreground text-sm">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <UserCheck className="text-success h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {mockUsers.filter((u) => u.email_verified_at).length}
                </p>
                <p className="text-muted-foreground text-sm">Active Users</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-warning/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Shield className="text-warning h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {
                    mockUsers.filter(
                      (u) => u.identity_verification_state === "verified",
                    ).length
                  }
                </p>
                <p className="text-muted-foreground text-sm">Verified Users</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-chart-6/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <FileText className="text-chart-6 h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {mockUsers.reduce((total, user) => total + user.cv.length, 0)}
                </p>
                <p className="text-muted-foreground text-sm">Total CVs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <UsersTable
          onViewUser={handleViewUser}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* User Detail Modal */}
        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      </div>
    </div>
  );
}
