"use client";

import { User } from "@/types/api";
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

interface IdentityDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (userId: number) => void;
  onReject?: (userId: number) => void;
}

export function IdentityDetailModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: IdentityDetailModalProps) {

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
        not_started: "secondary",
      };
      return variants[status as keyof typeof variants] || "secondary";
    };

    return (
      <Badge variant={getVariant(status) as any}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Identity Verification: {user.first_name} {user.last_name}
              </DialogTitle>
              <DialogDescription>
                ID: {user.uuid} • Status: {user.identity_verification_state}
              </DialogDescription>
            </DialogHeader>

            {/* Content */}
            <div className="space-y-6 p-6">
          {/* Identity Documents Status */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Identity Documents
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-foreground font-medium">
                  Identity Verification Form
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      user.verify_identity_form_filled
                        ? "bg-success"
                        : "bg-destructive",
                    )}
                  />
                  <span className="text-muted-foreground text-sm">
                    {user.verify_identity_form_filled
                      ? "Completed"
                      : "Not Completed"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-background flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      📄
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Avatar Photo
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Profile picture
                      </p>
                    </div>
                  </div>
                  <span className="text-success text-sm">Submitted</span>
                </div>

                <div className="bg-background flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      🆔
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        ID Card Front
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Front side of identity document
                      </p>
                    </div>
                  </div>
                  <span className="text-success text-sm">Submitted</span>
                </div>

                <div className="bg-background flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      🆔
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        ID Card Back
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Back side of identity document
                      </p>
                    </div>
                  </div>
                  <span className="text-success text-sm">Submitted</span>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information Verification */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Full Name
                </label>
                <p className="text-foreground font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-success h-2 w-2 rounded-full"></div>
                  <span className="text-success text-xs">Verified</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Birth Date
                </label>
                <p className="text-foreground font-medium">
                  {formatDate(user.birth_date)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-warning h-2 w-2 rounded-full"></div>
                  <span className="text-warning text-xs">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Gender
                </label>
                <p className="text-foreground font-medium capitalize">
                  {user.gender}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-success h-2 w-2 rounded-full"></div>
                  <span className="text-success text-xs">Verified</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Nationality
                </label>
                <p className="text-foreground font-medium">
                  {user.nationality?.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-warning h-2 w-2 rounded-full"></div>
                  <span className="text-warning text-xs">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <p className="text-foreground font-medium">{user.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      user.email_verified_at ? "bg-success" : "bg-warning",
                    )}
                  ></div>
                  <span
                    className={cn(
                      "text-xs",
                      user.email_verified_at ? "text-success" : "text-warning",
                    )}
                  >
                    {user.email_verified_at
                      ? "Verified"
                      : "Pending Verification"}
                  </span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <p className="text-foreground font-medium">
                  {user.phone || "Not provided"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-warning h-2 w-2 rounded-full"></div>
                  <span className="text-warning text-xs">
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Address Information
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Street Address
                  </label>
                  <p className="text-foreground">
                    {user.street || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    City
                  </label>
                  <p className="text-foreground">
                    {user.city?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Province
                  </label>
                  <p className="text-foreground">
                    {user.city?.province?.name || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-warning h-2 w-2 rounded-full"></div>
                <span className="text-warning text-xs">
                  Address verification pending
                </span>
              </div>
            </div>
          </section>

          {/* Verification Status */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Current Verification Status
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">
                    Identity Verification
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Submitted: {formatDate(user.completed_identity_at)}
                  </p>
                </div>
                {getVerificationStatus(user.identity_verification_state)}
              </div>

              <div className="border-border mt-4 border-t pt-4">
                <h4 className="text-foreground mb-2 text-sm font-medium">
                  Verification Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-success h-2 w-2 rounded-full"></div>
                    <span className="text-foreground text-sm">
                      Documents uploaded
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        user.identity_verification_state === "under_review"
                          ? "bg-warning"
                          : "bg-muted",
                      )}
                    ></div>
                    <span className="text-foreground text-sm">
                      Under review
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        user.identity_verification_state === "verified"
                          ? "bg-success"
                          : "bg-muted",
                      )}
                    ></div>
                    <span className="text-foreground text-sm">
                      Verification complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {user.identity_verification_state === "pending" && (
            <>
              {onReject && (
                <Button
                  variant="destructive"
                  onClick={() => onReject(user.id)}
                >
                  Reject Identity
                </Button>
              )}
              {onApprove && (
                <Button
                  variant="success"
                  onClick={() => onApprove(user.id)}
                >
                  Verify Identity
                </Button>
              )}
            </>
          )}
        </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <p>No user data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
