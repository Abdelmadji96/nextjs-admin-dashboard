"use client";

import type { Candidate } from "@/types/candidate";
import { Button, Typography } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Eye,
  Download,
} from "lucide-react";

interface UserDetailModalProps {
  user: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (userId: number) => void;
  onReject?: (userId: number) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: UserDetailModalProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getVerificationBadge = (status: string) => {
    const statusMap = {
      verified: { variant: "success" as const, label: "Verified", icon: CheckCircle },
      pending: { variant: "warning" as const, label: "Pending", icon: Clock },
      canceled: { variant: "destructive" as const, label: "Rejected", icon: XCircle },
      unverified: { variant: "secondary" as const, label: "Not Submitted", icon: XCircle },
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.unverified;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1.5">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getCVStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="secondary">No CV</Badge>;
    }

    const statusMap = {
      published: { variant: "success" as const, label: "Published" },
      draft: { variant: "warning" as const, label: "Draft" },
      pending: { variant: "warning" as const, label: "Pending" },
      canceled: { variant: "destructive" as const, label: "Canceled" },
    };

    const config = statusMap[status as keyof typeof statusMap] || { variant: "secondary" as const, label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.first_name} {user.last_name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <span>ID: <span className="font-mono">{user.id}</span></span>
            <span>•</span>
            <span>Ref: <span className="font-mono">{user.reference}</span></span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Quick Stats */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Typography variant="label" className="mb-2 flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                Identity Status
              </Typography>
              {getVerificationBadge(user.identity_verification_state)}
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Typography variant="label" className="mb-2 flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                CV Status
              </Typography>
              {getCVStatusBadge(user.cv?.status || null)}
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <Typography variant="label" className="mb-2 flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4" />
                Diplomas
              </Typography>
              <div className="flex items-center gap-2">
                <Badge variant="success">{user.stats.diplomas.verified}</Badge>
                <Badge variant="warning">{user.stats.diplomas.pending}</Badge>
                <Badge variant="destructive">{user.stats.diplomas.canceled}</Badge>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section>
            <Typography variant="h4" className="mb-4">
              Personal Information
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Full Name
                </Typography>
                <Typography variant="body">
                  {user.first_name} {user.last_name}
                </Typography>
              </div>

              <div>
                <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Typography>
                <Typography variant="body" className="break-all">
                  {user.email}
                </Typography>
                {user.email_verified_at && (
                  <Typography variant="caption" className="mt-1 flex items-center gap-1 text-success">
                    <CheckCircle className="h-3 w-3" />
                    Verified on {formatDate(user.email_verified_at)}
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </Typography>
                <Typography variant="body">
                  {user.phone || "Not provided"}
                </Typography>
              </div>

              <div>
                <Typography variant="label" className="mb-1 text-muted-foreground">
                  Gender
                </Typography>
                <Typography variant="body" className="capitalize">
                  {user.gender || "Not provided"}
                </Typography>
              </div>

              <div>
                <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Birth Date
                </Typography>
                <Typography variant="body">
                  {formatDate(user.birth_date)}
                </Typography>
              </div>

              <div>
                <Typography variant="label" className="mb-1 text-muted-foreground">
                  User Type
                </Typography>
                <Badge variant="default" className="capitalize">
                  {user.user_type}
                </Badge>
              </div>
            </div>
          </section>

          {/* CV Information */}
          {user.cv && (
            <section>
              <Typography variant="h4" className="mb-4">
                CV Information
              </Typography>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Typography variant="label" className="mb-1 text-muted-foreground">
                      Status
                    </Typography>
                    {getCVStatusBadge(user.cv.status)}
                  </div>

                  <div>
                    <Typography variant="label" className="mb-1 text-muted-foreground">
                      Update Count
                    </Typography>
                    <Typography variant="body">
                      {user.cv.cv_update_count} updates
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="label" className="mb-1 text-muted-foreground">
                      Last Published
                    </Typography>
                    <Typography variant="body">
                      {formatDate(user.cv.last_published_at)}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      Views
                    </Typography>
                    <Typography variant="body">
                      {user.cv.seen_count} views
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="label" className="mb-1 flex items-center gap-2 text-muted-foreground">
                      <Download className="h-3.5 w-3.5" />
                      Downloads
                    </Typography>
                    <Typography variant="body">
                      {user.cv.download_count} downloads
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="label" className="mb-1 text-muted-foreground">
                      Created At
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.cv.created_at)}
                    </Typography>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Diploma Statistics */}
          <section>
            <Typography variant="h4" className="mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Diploma Statistics
            </Typography>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="rounded-lg border border-success/50 bg-success/10 p-3 text-center">
                <Typography variant="h3" className="text-success">
                  {user.stats.diplomas.verified}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Verified
                </Typography>
              </div>

              <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-center">
                <Typography variant="h3" className="text-warning">
                  {user.stats.diplomas.pending}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Pending
                </Typography>
              </div>

              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-center">
                <Typography variant="h3" className="text-destructive">
                  {user.stats.diplomas.canceled}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Rejected
                </Typography>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <Typography variant="h3">
                  {user.stats.diplomas.unverified}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Unverified
                </Typography>
              </div>

              <div className="rounded-lg border border-primary/50 bg-primary/10 p-3 text-center">
                <Typography variant="h3" className="text-primary">
                  {user.stats.diplomas.total}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Total
                </Typography>
              </div>
            </div>
          </section>

          {/* Timestamps */}
          <section>
            <Typography variant="h4" className="mb-4">
              Account Timeline
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <Typography variant="label" className="text-muted-foreground">
                    Created
                  </Typography>
                  <Typography variant="bodySmall">
                    {formatDate(user.created_at)}
                  </Typography>
                </div>
              </div>

              {user.completed_registration_at && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                  <div>
                    <Typography variant="label" className="text-muted-foreground">
                      Registration Completed
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_registration_at)}
                    </Typography>
                  </div>
                </div>
              )}

              {user.completed_identity_at && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                  <div>
                    <Typography variant="label" className="text-muted-foreground">
                      Identity Completed
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_identity_at)}
                    </Typography>
                  </div>
                </div>
              )}

              {user.completed_verification_at && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                  <div>
                    <Typography variant="label" className="text-muted-foreground">
                      Verification Completed
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_verification_at)}
                    </Typography>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <Typography variant="label" className="text-muted-foreground">
                    Last Updated
                  </Typography>
                  <Typography variant="bodySmall">
                    {formatDate(user.updated_at)}
                  </Typography>
                </div>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="gap-2">
          {onReject && user.identity_verification_state === "pending" && (
            <Button
              variant="destructive"
              onClick={() => onReject(user.id)}
            >
              Reject Verification
            </Button>
          )}
          {onApprove && user.identity_verification_state === "pending" && (
            <Button
              variant="default"
              onClick={() => onApprove(user.id)}
            >
              Approve Verification
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
