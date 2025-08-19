"use client";

import { Diploma, User } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DiplomaDetailModalProps {
  diploma: Diploma | null;
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (diplomaId: number) => void;
  onReject?: (diplomaId: number) => void;
}

export function DiplomaDetailModal({
  diploma,
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DiplomaDetailModalProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const getVerificationStatus = (status: string) => {
    const getVariant = (status: string) => {
      const variants = {
        verified: "success",
        pending: "pending",
        rejected: "rejected",
        under_review: "under-review",
      };
      return variants[status as keyof typeof variants] || "secondary";
    };

    return (
      <Badge variant={getVariant(status) as any}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getModalityBadge = (modality: string) => {
    const getVariant = (modality: string) => {
      const variants = {
        "on-campus": "default",
        "online": "warning",
        "hybrid": "success",
        "distance": "secondary",
      };
      return variants[modality as keyof typeof variants] || "secondary";
    };

    return (
      <Badge variant={getVariant(modality) as any}>
        {modality.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {diploma ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Diploma Verification Details
              </DialogTitle>
              <DialogDescription>
                ID: {diploma.id} • {diploma.title}
              </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Information */}
          {user && (
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">Student Information</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Student Name
                    </label>
                    <p className="text-foreground font-medium">{user.first_name} {user.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Phone
                    </label>
                    <p className="text-foreground">{user.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Nationality
                    </label>
                    <p className="text-foreground">{user.nationality?.name || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Diploma Information */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Diploma Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Title
                  </label>
                  <p className="text-foreground font-medium">{diploma.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Institution
                  </label>
                  <p className="text-foreground font-medium">{diploma.institution}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Start Date
                  </label>
                  <p className="text-foreground">{formatDate(diploma.start_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    End Date
                  </label>
                  <p className="text-foreground">{formatDate(diploma.end_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Modality
                  </label>
                  <div>{getModalityBadge(diploma.modality)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Current Status
                  </label>
                  <div className="flex items-center gap-2">
                    {diploma.is_current && (
                      <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                        CURRENT
                      </span>
                    )}
                    {!diploma.is_current && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                        COMPLETED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Diploma Level Information */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Diploma Level & Type
                </label>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Level:</span>
                      <p className="text-foreground font-medium">{diploma.diploma_level?.designation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <p className="text-foreground font-medium">{diploma.diploma_level?.diploma_type?.designation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {diploma.description && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </label>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-foreground">{diploma.description}</p>
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Verification Status
                </label>
                <div className="flex items-center gap-4">
                  {getVerificationStatus(diploma.verification_status)}
                  <span className="text-sm text-muted-foreground">
                    Last updated: {formatDate(diploma.end_date)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Verification Timeline */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Verification Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <p className="text-foreground font-medium">Diploma Submitted</p>
                  <p className="text-sm text-muted-foreground">{formatDate(diploma.start_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div>
                  <p className="text-foreground font-medium">Under Review</p>
                  <p className="text-sm text-muted-foreground">Verification in progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  diploma.verification_status === "verified" ? "bg-success" : "bg-muted"
                )}></div>
                <div>
                  <p className={cn(
                    "font-medium",
                    diploma.verification_status === "verified" ? "text-foreground" : "text-muted-foreground"
                  )}>
                    Verification {diploma.verification_status === "verified" ? "Completed" : "Pending"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {diploma.verification_status === "verified" ? "Diploma verified successfully" : "Awaiting verification"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {diploma.verification_status === "pending" && (
            <>
              {onReject && (
                <Button
                  variant="destructive"
                  onClick={() => onReject(diploma.id)}
                >
                  Reject Diploma
                </Button>
              )}
              {onApprove && (
                <Button
                  variant="success"
                  onClick={() => onApprove(diploma.id)}
                >
                  Verify Diploma
                </Button>
              )}
            </>
          )}
        </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <p>No diploma data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
