import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button, Typography, Input, Card } from "@/components/ui";
import { KeyRound, ArrowLeft, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password - Admin Dashboard",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-primary-light/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={35}
                className="hidden dark:block"
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={35}
                className="dark:hidden"
              />
            </Link>
          </div>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <Typography variant="h2" className="mb-2">
              Forgot Password?
            </Typography>
            <Typography variant="muted">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </Typography>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <Typography variant="label" className="mb-2">
                Email Address
              </Typography>
              <Input
                type="email"
                placeholder="john@example.com"
                inputSize="lg"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
            >
              Send Reset Link
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Button
              variant="link"
              size="sm"
              asChild
              className="h-auto p-0"
            >
              <Link href="/login" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <Typography variant="label" className="mb-1 text-sm">
                  Can't access your email?
                </Typography>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Contact our support team at{" "}
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="h-auto p-0 text-sm"
                  >
                    <Link href="/support">support@example.com</Link>
                  </Button>
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

