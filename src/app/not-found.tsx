import Link from "next/link";
import { Button, Typography } from "@/components/ui";
import { Frown, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <Typography
            variant="h1"
            className="text-[150px] font-black leading-none text-primary opacity-10 sm:text-[200px]"
            as="div"
          >
            404
          </Typography>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                <Frown className="h-10 w-10 text-primary" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <Typography variant="h2" className="text-3xl sm:text-4xl">
            Page Not Found
          </Typography>
          <Typography
            variant="bodyLarge"
            className="mx-auto max-w-md text-text-placeholder"
          >
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" asChild>
            <Link href="/">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 rounded-lg border border-border bg-note p-6">
          <Typography variant="label" className="mb-2">
            Need Help?
          </Typography>
          <Typography variant="bodySmall" className="text-text-placeholder">
            If you believe this is an error, please{" "}
            <Button variant="link" size="sm" asChild className="h-auto p-0">
              <Link href="/support">contact support</Link>
            </Button>
            .
          </Typography>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-primary/5 absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-primary-light/10 absolute -right-20 bottom-20 h-96 w-96 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
