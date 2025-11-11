"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Badge, Typography } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/hooks/usePost";
import { useFetch } from "@/hooks/useFetch";
import { approveDiploma, rejectDiploma } from "@/services/diploma.service";
import {
  getCandidateMedias,
  organizeCandidateMedias,
  getMediaUrl,
} from "@/services/media.service";
import type { Diploma } from "@/types/diploma";
import {
  CalendarDays,
  Building2,
  GraduationCap,
  User,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiplomaDetailModalProps {
  diploma: Diploma;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  showActions?: boolean; // Show approve/reject buttons only for pending tab
}

export function DiplomaDetailModal({
  diploma,
  isOpen,
  onClose,
  onSuccess,
  showActions = false,
}: DiplomaDetailModalProps) {
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  // Track rotation for each diploma image by index
  const [imageRotations, setImageRotations] = useState<Record<number, number>>(
    {},
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const { mutate: approve, isPending: isApproving } = usePost(approveDiploma);
  const { mutate: reject, isPending: isRejecting } = usePost(rejectDiploma);

  // Fetch candidate media
  const candidate = diploma.cv_version.cv.candidate;
  const {
    data: mediaResponse,
    isLoading: isLoadingMedia,
    error: mediaError,
  } = useFetch(
    ["candidate-media", candidate.reference],
    () => getCandidateMedias(candidate.reference),
    {
      enabled: isOpen,
    },
  );

  const medias = mediaResponse?.data
    ? organizeCandidateMedias(mediaResponse.data)
    : null;

  // Filter diploma images for THIS specific diploma only
  const currentDiplomaImages =
    medias?.diplomas?.filter((media) => media.model_id === diploma.reference) ||
    [];

  const handleRotateImage = (index: number) => {
    setImageRotations((prev) => ({
      ...prev,
      [index]: ((prev[index] || 0) + 90) % 360,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseZoom = () => {
    setSelectedImageIndex(null);
  };

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (selectedImageIndex === null || currentDiplomaImages.length === 0)
      return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseZoom();
      } else if (e.key === "ArrowLeft" && currentDiplomaImages.length > 1) {
        e.preventDefault();
        const newIndex =
          (selectedImageIndex - 1 + currentDiplomaImages.length) %
          currentDiplomaImages.length;
        setSelectedImageIndex(newIndex);
      } else if (e.key === "ArrowRight" && currentDiplomaImages.length > 1) {
        e.preventDefault();
        const newIndex = (selectedImageIndex + 1) % currentDiplomaImages.length;
        setSelectedImageIndex(newIndex);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRotateImage(selectedImageIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, currentDiplomaImages.length, imageRotations]);

  const handleApprove = () => {
    setConfirmAction("approve");
  };

  const handleReject = () => {
    setConfirmAction("reject");
  };

  const handleConfirmAction = () => {
    if (confirmAction === "approve") {
      approve(diploma.id, {
        onSuccess: () => {
          setConfirmAction(null);
          onSuccess?.();
          onClose();
        },
        onError: () => {
          setConfirmAction(null);
        },
      });
    } else if (confirmAction === "reject") {
      reject(diploma.id, {
        onSuccess: () => {
          setConfirmAction(null);
          onSuccess?.();
          onClose();
        },
        onError: () => {
          setConfirmAction(null);
        },
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Diploma["verification_status"]) => {
    switch (status) {
      case "verified":
        return <Badge variant="success">Verified</Badge>;
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "canceled":
        return <Badge variant="destructive">Rejected</Badge>;
      case "unverified":
      default:
        return <Badge className="bg-inherit text-orange-600">Unverified</Badge>;
    }
  };

  const getModalityBadge = (modality: Diploma["modality"]) => {
    switch (modality) {
      case "onsite":
        return <Badge variant="default">On-site</Badge>;
      case "remote":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Remote
          </Badge>
        );
      case "hybrid":
        return <Badge variant="success">Hybrid</Badge>;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Diploma Verification Details
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span className="font-mono text-xs">{diploma.reference}</span>
              <span>•</span>
              {getStatusBadge(diploma.verification_status)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {/* Diploma Images */}
            <section>
              <Typography
                variant="h5"
                className="mb-4 flex items-center gap-2 text-foreground"
              >
                <ImageIcon className="h-4 w-4" />
                Diploma Images
              </Typography>
              <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                {isLoadingMedia ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Skeleton className="aspect-[3/2] w-full rounded-lg" />
                    <Skeleton className="aspect-[3/2] w-full rounded-lg" />
                  </div>
                ) : mediaError ? (
                  <div className="border-muted-foreground/25 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                    <XCircle className="mb-2 h-8 w-8 text-destructive" />
                    <Typography
                      variant="bodySmall"
                      className="text-muted-foreground"
                    >
                      Failed to load diploma images
                    </Typography>
                  </div>
                ) : currentDiplomaImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentDiplomaImages.map((media, index) => {
                      const rotation = imageRotations[index] || 0;
                      return (
                        <div key={media.id} className="relative">
                          <div className="mb-2 flex items-center justify-between">
                            <Typography
                              variant="caption"
                              className="text-muted-foreground"
                            >
                              Diploma Image {index + 1}
                            </Typography>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRotateImage(index)}
                              className="h-7 w-7"
                              title="Rotate image"
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <div
                            className="group relative aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-lg border border-border transition-all hover:ring-2 hover:ring-primary"
                            onClick={() => handleImageClick(index)}
                          >
                            <Image
                              src={getMediaUrl(media.hash)}
                              alt={`Diploma Image ${index + 1}`}
                              fill
                              className="object-cover transition-all duration-300 group-hover:scale-105"
                              style={{ transform: `rotate(${rotation}deg)` }}
                              unoptimized
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                              <ZoomIn className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-muted-foreground/25 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                    <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <Typography
                      variant="bodySmall"
                      className="text-muted-foreground"
                    >
                      No diploma images available
                    </Typography>
                  </div>
                )}
              </div>
            </section>

            {/* Diploma Information */}
            <section>
              <Typography
                variant="h5"
                className="mb-4 flex items-center gap-2 text-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                Diploma Information
              </Typography>
              <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Title
                  </label>
                  <Typography variant="body" className="text-foreground">
                    {diploma.title}
                  </Typography>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Diploma Level
                    </label>
                    <Typography variant="bodySmall" className="text-foreground">
                      {diploma.diploma_level.designation}
                    </Typography>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Diploma Type
                    </label>
                    <Typography variant="bodySmall" className="text-foreground">
                      {diploma.diploma_level.diploma_type.designation}
                    </Typography>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Institution
                  </label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Typography variant="bodySmall" className="text-foreground">
                      {diploma.institution}
                    </Typography>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Start Date
                    </label>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <Typography
                        variant="bodySmall"
                        className="text-foreground"
                      >
                        {formatDate(diploma.start_date)}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      End Date
                    </label>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <Typography
                        variant="bodySmall"
                        className="text-foreground"
                      >
                        {formatDate(diploma.end_date)}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Modality
                    </label>
                    {getModalityBadge(diploma.modality)}
                  </div>
                </div>

                {diploma.description && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: diploma.description }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Candidate Information */}
            <section>
              <Typography
                variant="h5"
                className="mb-4 flex items-center gap-2 text-foreground"
              >
                <User className="h-4 w-4" />
                Candidate Information
              </Typography>
              <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <Typography variant="bodySmall" className="text-foreground">
                      {candidate.first_name} {candidate.last_name}
                    </Typography>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <Typography
                        variant="bodySmall"
                        className="text-foreground"
                      >
                        {candidate.email}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <Typography variant="bodySmall" className="text-foreground">
                      {candidate.phone}
                    </Typography>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    CV Status
                  </label>
                  <Badge
                    variant={
                      diploma.cv_version.cv.status === "published"
                        ? "success"
                        : "pending"
                    }
                  >
                    {diploma.cv_version.cv.status === "published"
                      ? "Published"
                      : "Draft"}
                  </Badge>
                </div>
              </div>
            </section>

            {/* Verification Status */}
            {diploma.verified_at && (
              <section>
                <Typography variant="h5" className="mb-4 text-foreground">
                  Verification Status
                </Typography>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography
                        variant="bodySmall"
                        className="font-medium text-foreground"
                      >
                        Verified At
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-muted-foreground"
                      >
                        {formatDate(diploma.verified_at)}
                      </Typography>
                    </div>
                    {getStatusBadge(diploma.verification_status)}
                  </div>
                </div>
              </section>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {showActions && diploma.verification_status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting || isApproving}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Diploma
                </Button>
                <Button
                  variant="success"
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Verify Diploma
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction === "approve" ? "Verify Diploma" : "Reject Diploma"
        }
        description={
          confirmAction === "approve"
            ? `Are you sure you want to verify the diploma "${diploma.title}"? This action cannot be undone.`
            : `Are you sure you want to reject the diploma "${diploma.title}"? This action cannot be undone.`
        }
        confirmText={confirmAction === "approve" ? "Verify" : "Reject"}
        confirmVariant={confirmAction === "approve" ? "primary" : "destructive"}
        icon={confirmAction === "approve" ? CheckCircle2 : XCircle}
        isLoading={isApproving || isRejecting}
      />

      {/* Image Zoom Modal */}
      {selectedImageIndex !== null && currentDiplomaImages.length > 0 && (
        <Dialog
          open={selectedImageIndex !== null}
          onOpenChange={handleCloseZoom}
        >
          <DialogContent className="max-h-[95vh] max-w-[95vw] p-0">
            <div className="relative flex h-[90vh] w-full items-center justify-center bg-black">
              {/* Top Controls */}
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRotateImage(selectedImageIndex)}
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

              {/* Image Counter */}
              {currentDiplomaImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                  {selectedImageIndex + 1} / {currentDiplomaImages.length}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentDiplomaImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newIndex =
                        (selectedImageIndex - 1 + currentDiplomaImages.length) %
                        currentDiplomaImages.length;
                      setSelectedImageIndex(newIndex);
                    }}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    title="Previous (←)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newIndex =
                        (selectedImageIndex + 1) % currentDiplomaImages.length;
                      setSelectedImageIndex(newIndex);
                    }}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    title="Next (→)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </>
              )}

              {/* Main Image */}
              <div className="relative h-[85vh] w-[85vw]">
                <Image
                  src={getMediaUrl(
                    currentDiplomaImages[selectedImageIndex].hash,
                  )}
                  alt={`Diploma Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain transition-transform duration-300"
                  style={{
                    transform: `rotate(${imageRotations[selectedImageIndex] || 0}deg)`,
                  }}
                  unoptimized
                  priority
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
