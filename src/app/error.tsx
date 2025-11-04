"use client";

import { useEffect } from "react";
import { TriangleAlert, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-2xl text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-6">
            <TriangleAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            Something Went Wrong
          </h1>
          <p className="text-lg text-text-placeholder">
            We're sorry, but something unexpected happened. Our team has been
            notified and is working on fixing the issue.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="border-destructive/20 bg-destructive/5 mt-6 rounded-lg border p-4 text-left">
              <p className="mb-2 text-sm font-semibold text-destructive">
                Error Details:
              </p>
              <p className="break-all font-mono text-sm text-text-placeholder">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-text-placeholder">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-button bg-primary-button px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center gap-2 rounded-button border border-border bg-card px-6 py-3 text-base font-medium text-text transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Go Home
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 rounded-lg border border-border bg-note p-6">
          <h3 className="mb-2 text-sm font-semibold text-text">
            Still Having Issues?
          </h3>
          <p className="text-sm text-text-placeholder">
            If the problem persists, please reach out to our{" "}
            <a
              href="/support"
              className="font-medium text-primary-button hover:text-primary-bold hover:underline"
            >
              support team
            </a>{" "}
            for assistance.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-destructive/5 absolute left-1/4 top-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-primary-light/5 absolute bottom-20 right-1/4 h-96 w-96 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
