import { SkeletonAvatar, Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for UserInfo component
 * Displays animated placeholder while loading user data
 */
export function UserInfoSkeleton() {
  return (
    <div 
      className="flex items-center gap-3"
      role="status"
      aria-label="Loading user information"
    >
      {/* Avatar skeleton */}
      <SkeletonAvatar size="default" />
      
      {/* Name and email skeleton - only visible on larger screens */}
      <div className="hidden space-y-2 max-[1024px]:hidden lg:block">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      <span className="sr-only">Loading user information...</span>
    </div>
  );
}

