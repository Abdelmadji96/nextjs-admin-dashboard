"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant for different skeleton shapes
   */
  variant?: "text" | "circular" | "rectangular" | "rounded";
  /**
   * Animation style
   */
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton component for loading states
 * Provides animated placeholders while content is loading
 * 
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton className="h-4 w-full" />
 * 
 * // Circular avatar skeleton
 * <Skeleton variant="circular" className="size-12" />
 * 
 * // Card skeleton
 * <Skeleton variant="rounded" className="h-32 w-full" />
 * ```
 */
export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted",
        {
          // Variants
          "rounded-none": variant === "rectangular",
          "rounded-full": variant === "circular",
          "rounded": variant === "rounded",
          "rounded-sm": variant === "text",
          
          // Animations
          "animate-pulse": animation === "pulse",
          "animate-wave": animation === "wave",
        },
        className
      )}
      role="status"
      aria-label="Loading..."
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton Text component
 * Pre-configured for text loading states
 */
export function SkeletonText({
  className,
  lines = 1,
  ...props
}: Omit<SkeletonProps, "variant"> & { lines?: number }) {
  if (lines === 1) {
    return <Skeleton variant="text" className={cn("h-4 w-full", className)} {...props} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            "h-4",
            index === lines - 1 ? "w-4/5" : "w-full",
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Avatar component
 * Pre-configured for avatar loading states
 */
export function SkeletonAvatar({
  className,
  size = "default",
  ...props
}: Omit<SkeletonProps, "variant"> & {
  size?: "sm" | "default" | "lg" | "xl";
}) {
  return (
    <Skeleton
      variant="circular"
      className={cn(
        {
          "size-8": size === "sm",
          "size-12": size === "default",
          "size-16": size === "lg",
          "size-20": size === "xl",
        },
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton Card component
 * Pre-configured for card loading states
 */
export function SkeletonCard({
  className,
  ...props
}: Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-card p-6", className)}>
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
