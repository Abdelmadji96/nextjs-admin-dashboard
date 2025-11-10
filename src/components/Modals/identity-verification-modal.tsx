"use client";

import type { CandidateIdentity } from "@/types/identity";
import {
  Button,
  Typography,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ConfirmDialog,
  ImageZoom,
} from "@/components/ui";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ImageIcon,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePost } from "@/hooks/usePost";
import { approveIdentity, rejectIdentity } from "@/services/identity.service";
import {
  getCandidateMedias,
  organizeCandidateMedias,
  getMediaUrl,
} from "@/services/media.service";
import type { CandidateMedias } from "@/types/media";
import Image from "next/image";

interface IdentityVerificationModalProps {
  user: CandidateIdentity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  showActions?: boolean; // Show approve/reject buttons for pending verifications
}

export function IdentityVerificationModal({
  user,
  isOpen,
  onClose,
  onSuccess,
  showActions = false,
}: IdentityVerificationModalProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [medias, setMedias] = useState<CandidateMedias | null>(null);
  const [isLoadingMedias, setIsLoadingMedias] = useState(false);

  const { mutate: approve, isPending: isApproving } = usePost(approveIdentity);
  const { mutate: reject, isPending: isRejecting } = usePost(rejectIdentity);

  const isProcessing = isApproving || isRejecting;

  // Fetch candidate medias when modal opens
  useEffect(() => {
    if (isOpen && user?.reference) {
      setIsLoadingMedias(true);
      getCandidateMedias(user.reference)
        .then((response) => {
          const organizedMedias = organizeCandidateMedias(response.data);
          setMedias(organizedMedias);
        })
        .catch((error) => {
          console.error("[Media] Failed to fetch medias:", error);
          setMedias(null);
        })
        .finally(() => {
          setIsLoadingMedias(false);
        });
    } else {
      setMedias(null);
    }
  }, [isOpen, user?.reference]);

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
      verified: {
        variant: "success" as const,
        label: "Verified",
        icon: CheckCircle,
      },
      pending: { variant: "warning" as const, label: "Pending", icon: Clock },
      canceled: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
      },
      unverified: {
        variant: "secondary" as const,
        label: "Not Submitted",
        icon: XCircle,
      },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.unverified;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1.5">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleApprove = () => {
    if (!user) return;

    approve(user.id, {
      onSuccess: () => {
        console.log("[Identity] ✅ Approved user:", user.id);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      },
      onError: () => {
        console.error("[Identity] ❌ Approve failed");
        alert("Failed to approve identity verification. Please try again.");
      },
    });
  };

  const handleReject = () => {
    if (!user) return;
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!user) return;

    reject(user.id, {
      onSuccess: () => {
        console.log("[Identity] ✅ Rejected user:", user.id);
        setShowRejectDialog(false);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      },
      onError: () => {
        console.error("[Identity] ❌ Reject failed");
        setShowRejectDialog(false);
        alert("Failed to reject identity verification. Please try again.");
      },
    });
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] max-w-4xl overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on ImageZoom portal
          const target = e.target as HTMLElement;
          if (
            target.closest('[data-image-zoom-portal="true"]') ||
            target.hasAttribute("data-image-zoom-portal")
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.first_name} {user.last_name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <span>
              ID: <span className="font-mono">{user.id}</span>
            </span>
            <span>•</span>
            <span>
              Ref: <span className="font-mono">{user.reference}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Identity Verification Status */}
          <section className="bg-muted/30 rounded-lg border border-border p-4">
            <Typography
              variant="label"
              className="mb-2 flex items-center gap-2 text-muted-foreground"
            >
              <CheckCircle className="h-4 w-4" />
              Identity Verification Status
            </Typography>
            {getVerificationBadge(user.identity_verification_state)}
          </section>

          {/* Identity Documents */}
          <section>
            <Typography variant="h4" className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Identity Documents
            </Typography>

            {isLoadingMedias ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              (() => {
                // Build array of available images for gallery navigation
                const availableImages = [];
                if (medias?.avatar) {
                  availableImages.push({
                    src: getMediaUrl(medias.avatar.hash),
                    alt: "Candidate Avatar",
                  });
                }
                if (medias?.id_card_front) {
                  availableImages.push({
                    src: getMediaUrl(medias.id_card_front.hash),
                    alt: "ID Card Front",
                  });
                }
                if (medias?.id_card_back) {
                  availableImages.push({
                    src: getMediaUrl(medias.id_card_back.hash),
                    alt: "ID Card Back",
                  });
                }

                return (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Avatar */}
                    <div className="bg-muted/20 rounded-lg border border-border p-4">
                      <Typography
                        variant="label"
                        className="mb-2 flex items-center gap-2 text-muted-foreground"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Avatar
                      </Typography>
                      {medias?.avatar ? (
                        <ImageZoom
                          src={getMediaUrl(medias.avatar.hash)}
                          alt="Candidate Avatar"
                          className="aspect-square w-full rounded-lg"
                          unoptimized
                          images={availableImages}
                          initialIndex={0}
                        />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted">
                          <Typography variant="muted" className="text-xs">
                            No avatar
                          </Typography>
                        </div>
                      )}
                    </div>

                    {/* ID Card Front */}
                    <div className="bg-muted/20 rounded-lg border border-border p-4">
                      <Typography
                        variant="label"
                        className="mb-2 flex items-center gap-2 text-muted-foreground"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        ID Card (Front)
                      </Typography>
                      {medias?.id_card_front ? (
                        <ImageZoom
                          src={getMediaUrl(medias.id_card_front.hash)}
                          alt="ID Card Front"
                          className="aspect-[1.6/1] w-full rounded-lg"
                          unoptimized
                          images={availableImages}
                          initialIndex={medias?.avatar ? 1 : 0}
                        />
                      ) : (
                        <div className="flex aspect-[1.6/1] w-full items-center justify-center rounded-lg bg-muted">
                          <Typography variant="muted" className="text-xs">
                            Not uploaded
                          </Typography>
                        </div>
                      )}
                    </div>

                    {/* ID Card Back */}
                    <div className="bg-muted/20 rounded-lg border border-border p-4">
                      <Typography
                        variant="label"
                        className="mb-2 flex items-center gap-2 text-muted-foreground"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        ID Card (Back)
                      </Typography>
                      {medias?.id_card_back ? (
                        <ImageZoom
                          src={getMediaUrl(medias.id_card_back.hash)}
                          alt="ID Card Back"
                          className="aspect-[1.6/1] w-full rounded-lg"
                          unoptimized
                          images={availableImages}
                          initialIndex={availableImages.length - 1}
                        />
                      ) : (
                        <div className="flex aspect-[1.6/1] w-full items-center justify-center rounded-lg bg-muted">
                          <Typography variant="muted" className="text-xs">
                            Not uploaded
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </section>

          {/* Personal Information */}
          <section>
            <Typography variant="h4" className="mb-4">
              Personal Information
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography
                  variant="label"
                  className="mb-1 flex items-center gap-2 text-muted-foreground"
                >
                  <User className="h-3.5 w-3.5" />
                  Full Name
                </Typography>
                <Typography variant="body">
                  {user.first_name} {user.last_name}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="label"
                  className="mb-1 flex items-center gap-2 text-muted-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Typography>
                <Typography variant="body" className="break-all">
                  {user.email}
                </Typography>
                {user.email_verified_at && (
                  <Typography
                    variant="caption"
                    className="mt-1 flex items-center gap-1 text-success"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verified on {formatDate(user.email_verified_at)}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="label"
                  className="mb-1 flex items-center gap-2 text-muted-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </Typography>
                <Typography variant="body">
                  {user.phone || "Not provided"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="label"
                  className="mb-1 text-muted-foreground"
                >
                  Gender
                </Typography>
                <Typography variant="body" className="capitalize">
                  {user.gender || "Not provided"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="label"
                  className="mb-1 flex items-center gap-2 text-muted-foreground"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Birth Date
                </Typography>
                <Typography variant="body">
                  {formatDate(user.birth_date)}
                </Typography>
              </div>
            </div>
          </section>

          {/* Account Timeline */}
          <section>
            <Typography variant="h4" className="mb-4">
              Account Timeline
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="bg-muted/20 flex items-start gap-3 rounded-lg border border-border p-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
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
                <div className="bg-muted/20 flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                  <div>
                    <Typography
                      variant="label"
                      className="text-muted-foreground"
                    >
                      Registration Completed
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_registration_at)}
                    </Typography>
                  </div>
                </div>
              )}

              {user.completed_identity_at && (
                <div className="bg-muted/20 flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                  <div>
                    <Typography
                      variant="label"
                      className="text-muted-foreground"
                    >
                      Identity Submitted
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_identity_at)}
                    </Typography>
                  </div>
                </div>
              )}

              {user.completed_verification_at && (
                <div className="bg-muted/20 flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-success" />
                  <div>
                    <Typography
                      variant="label"
                      className="text-muted-foreground"
                    >
                      Verification Completed
                    </Typography>
                    <Typography variant="bodySmall">
                      {formatDate(user.completed_verification_at)}
                    </Typography>
                  </div>
                </div>
              )}

              <div className="bg-muted/20 flex items-start gap-3 rounded-lg border border-border p-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
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
          {showActions && user.identity_verification_state === "pending" && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Reject Verification"}
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Approve Verification"}
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Identity Verification"
        description={`Are you sure you want to reject the identity verification for ${user.first_name} ${user.last_name}? This action cannot be undone.`}
        icon={AlertTriangle}
        confirmText="Reject"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={confirmReject}
        isLoading={isRejecting}
      />
    </Dialog>
  );
}
