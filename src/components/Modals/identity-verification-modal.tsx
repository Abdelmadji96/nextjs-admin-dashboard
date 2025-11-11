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
  Skeleton,
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
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [medias, setMedias] = useState<CandidateMedias | null>(null);
  const [isLoadingMedias, setIsLoadingMedias] = useState(false);
  const [imageRotations, setImageRotations] = useState<{
    avatar: number;
    id_card_front: number;
    id_card_back: number;
  }>({
    avatar: 0,
    id_card_front: 0,
    id_card_back: 0,
  });
  const [selectedImage, setSelectedImage] = useState<{
    type: "avatar" | "id_card_front" | "id_card_back";
    src: string;
    alt: string;
  } | null>(null);

  const { mutate: approve, isPending: isApproving } = usePost(approveIdentity);
  const { mutate: reject, isPending: isRejecting } = usePost(rejectIdentity);

  const isProcessing = isApproving || isRejecting;

  const handleRotateImage = (
    imageType: "avatar" | "id_card_front" | "id_card_back",
  ) => {
    setImageRotations((prev) => ({
      ...prev,
      [imageType]: (prev[imageType] + 90) % 360,
    }));
  };

  const handleImageClick = (
    imageType: "avatar" | "id_card_front" | "id_card_back",
    src: string,
    alt: string,
  ) => {
    setSelectedImage({ type: imageType, src, alt });
  };

  const handleCloseZoom = () => {
    setSelectedImage(null);
  };

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseZoom();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRotateImage(selectedImage.type);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, imageRotations]);

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
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    if (!user) return;

    approve(user.id, {
      onSuccess: () => {
        console.log("[Identity] ✅ Approved user:", user.id);
        setShowApproveDialog(false);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      },
      onError: () => {
        console.error("[Identity] ❌ Approve failed");
        setShowApproveDialog(false);
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-muted/20 rounded-lg border border-border p-4">
                  <Typography
                    variant="label"
                    className="mb-2 flex items-center gap-2 text-muted-foreground"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Avatar
                  </Typography>
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </div>
                <div className="bg-muted/20 rounded-lg border border-border p-4">
                  <Typography
                    variant="label"
                    className="mb-2 flex items-center gap-2 text-muted-foreground"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    ID Card (Front)
                  </Typography>
                  <Skeleton className="aspect-[1.6/1] w-full rounded-lg" />
                </div>
                <div className="bg-muted/20 rounded-lg border border-border p-4">
                  <Typography
                    variant="label"
                    className="mb-2 flex items-center gap-2 text-muted-foreground"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    ID Card (Back)
                  </Typography>
                  <Skeleton className="aspect-[1.6/1] w-full rounded-lg" />
                </div>
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
                      <div className="mb-2 flex items-center justify-between">
                        <Typography
                          variant="label"
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          Avatar
                        </Typography>
                        {medias?.avatar && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRotateImage("avatar")}
                            className="h-7 w-7"
                            title="Rotate image"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      {medias?.avatar ? (
                        <div
                          className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border border-border transition-all hover:ring-2 hover:ring-primary"
                          onClick={() =>
                            handleImageClick(
                              "avatar",
                              getMediaUrl(medias.avatar!.hash),
                              "Candidate Avatar",
                            )
                          }
                        >
                          <Image
                            src={getMediaUrl(medias.avatar.hash)}
                            alt="Candidate Avatar"
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                            style={{
                              transform: `rotate(${imageRotations.avatar}deg)`,
                            }}
                            unoptimized
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </div>
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
                      <div className="mb-2 flex items-center justify-between">
                        <Typography
                          variant="label"
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          ID Card (Front)
                        </Typography>
                        {medias?.id_card_front && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRotateImage("id_card_front")}
                            className="h-7 w-7"
                            title="Rotate image"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      {medias?.id_card_front ? (
                        <div
                          className="group relative aspect-[1.6/1] w-full cursor-pointer overflow-hidden rounded-lg border border-border transition-all hover:ring-2 hover:ring-primary"
                          onClick={() =>
                            handleImageClick(
                              "id_card_front",
                              getMediaUrl(medias.id_card_front!.hash),
                              "ID Card Front",
                            )
                          }
                        >
                          <Image
                            src={getMediaUrl(medias.id_card_front.hash)}
                            alt="ID Card Front"
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                            style={{
                              transform: `rotate(${imageRotations.id_card_front}deg)`,
                            }}
                            unoptimized
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </div>
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
                      <div className="mb-2 flex items-center justify-between">
                        <Typography
                          variant="label"
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          ID Card (Back)
                        </Typography>
                        {medias?.id_card_back && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRotateImage("id_card_back")}
                            className="h-7 w-7"
                            title="Rotate image"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      {medias?.id_card_back ? (
                        <div
                          className="group relative aspect-[1.6/1] w-full cursor-pointer overflow-hidden rounded-lg border border-border transition-all hover:ring-2 hover:ring-primary"
                          onClick={() =>
                            handleImageClick(
                              "id_card_back",
                              getMediaUrl(medias.id_card_back!.hash),
                              "ID Card Back",
                            )
                          }
                        >
                          <Image
                            src={getMediaUrl(medias.id_card_back.hash)}
                            alt="ID Card Back"
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                            style={{
                              transform: `rotate(${imageRotations.id_card_back}deg)`,
                            }}
                            unoptimized
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </div>
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

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Identity Verification"
        description={`Are you sure you want to approve the identity verification for ${user.first_name} ${user.last_name}? Please ensure all documents have been thoroughly reviewed.`}
        icon={CheckCircle}
        confirmText="Approve"
        cancelText="Cancel"
        confirmVariant="default"
        onConfirm={confirmApprove}
        isLoading={isApproving}
      />

      {/* Reject Confirmation Dialog */}
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

      {/* Image Zoom Modal */}
      {selectedImage && (
        <Dialog open={selectedImage !== null} onOpenChange={handleCloseZoom}>
          <DialogContent className="max-h-[95vh] max-w-[95vw] p-0">
            <div className="relative flex h-[90vh] w-full items-center justify-center bg-black">
              {/* Top Controls */}
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRotateImage(selectedImage.type)}
                  className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  title="Rotate image (R)"
                >
                  <RotateCw className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseZoom}
                  className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  title="Close (Esc)"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              {/* Image Label */}
              <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                {selectedImage.alt}
              </div>

              {/* Main Image */}
              <div className="relative h-[85vh] w-[85vw]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain transition-transform duration-300"
                  style={{
                    transform: `rotate(${imageRotations[selectedImage.type]}deg)`,
                  }}
                  unoptimized
                  priority
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
