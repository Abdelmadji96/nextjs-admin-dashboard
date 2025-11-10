"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  images?: Array<{ src: string; alt: string }>; // Optional array of images for gallery
  initialIndex?: number; // Which image to show first
}

export function ImageZoom({
  src,
  alt,
  className,
  fill = true,
  width,
  height,
  unoptimized = false,
  images,
  initialIndex = 0,
}: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Use images array if provided, otherwise create single-item array
  const imageArray = images || [{ src, alt }];
  const currentImage = imageArray[currentIndex];
  const hasMultipleImages = imageArray.length > 1;

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
  }, [imageArray.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + imageArray.length) % imageArray.length,
    );
  }, [imageArray.length]);

  // Reset to initial index when modal opens
  const handleOpen = () => {
    setCurrentIndex(initialIndex);
    setIsOpen(true);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior and stop propagation for all relevant keys
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Escape"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "ArrowLeft" && hasMultipleImages) {
        prevImage();
      } else if (e.key === "ArrowRight" && hasMultipleImages) {
        nextImage();
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, hasMultipleImages, prevImage, nextImage]);

  const lightboxContent = isOpen && (
    <div
      data-image-zoom-portal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
      >
        <X className="h-6 w-6" />
      </Button>

      <div
        className="relative h-[85vh] w-[85vw]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-contain"
          unoptimized={unoptimized}
          priority
        />
      </div>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {currentIndex + 1} / {imageArray.length}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleOpen}
        className={cn(
          "group relative h-auto w-full overflow-hidden p-0 transition-all hover:bg-transparent hover:ring-2 hover:ring-primary",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          unoptimized={unoptimized}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>
      </Button>

      {typeof window !== "undefined" && lightboxContent
        ? createPortal(lightboxContent, document.body)
        : null}
    </>
  );
}

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    label?: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function ImageGallery({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ImageGalleryProps) {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const galleryContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Image Counter */}
      <div
        className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Image Label */}
      {currentImage?.label && (
        <div
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {currentImage.label}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative h-[85vh] w-[85vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage?.src || ""}
          alt={currentImage?.alt || ""}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(galleryContent, document.body)
    : null;
}
