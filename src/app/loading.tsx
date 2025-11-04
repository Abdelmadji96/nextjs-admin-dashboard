export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-20 w-20">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>

            {/* Spinning Ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

            {/* Inner Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 animate-pulse rounded-full bg-primary"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text">
            Loading
            <span className="animate-pulse">...</span>
          </h2>
          <p className="text-sm text-text-placeholder">
            Please wait while we prepare your content
          </p>
        </div>

        {/* Progress Dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
