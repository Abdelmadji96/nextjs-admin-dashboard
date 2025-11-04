import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button, Typography, Input, Card } from "@/components/ui";
import { Check } from "lucide-react";
import { GoogleIcon } from "@/assets/icons";

export const metadata: Metadata = {
  title: "Sign Up - Admin Dashboard",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-primary-light/10 blur-3xl" />
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Branding */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="space-y-6">
              {/* Logo */}
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={180}
                  height={40}
                  className="hidden dark:block"
                />
                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={180}
                  height={40}
                  className="dark:hidden"
                />
              </Link>

              {/* Welcome Text */}
              <div className="space-y-4">
                <Typography variant="h1" className="text-4xl lg:text-5xl">
                  Get Started Today
                </Typography>
                <Typography variant="lead" className="max-w-md">
                  Create your account and unlock access to powerful dashboard
                  features.
                </Typography>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                {[
                  "Free 14-day trial",
                  "No credit card required",
                  "Full feature access",
                  "Cancel anytime",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <Typography variant="body">{feature}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex items-center justify-center">
            <Card
              variant="elevated"
              className="w-full max-w-md"
              padding="lg"
            >
              {/* Mobile Logo */}
              <div className="mb-8 text-center lg:hidden">
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

              {/* Form Header */}
              <div className="mb-8 text-center lg:text-left">
                <Typography variant="h2" className="mb-2">
                  Create Account
                </Typography>
                <Typography variant="muted">
                  Sign up to get started with your account
                </Typography>
              </div>

              {/* Social Sign Up */}
              <div className="mb-6 space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  type="button"
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Typography variant="label" className="mb-2">
                      First Name
                    </Typography>
                    <Input
                      type="text"
                      placeholder="John"
                      inputSize="lg"
                      required
                    />
                  </div>
                  <div>
                    <Typography variant="label" className="mb-2">
                      Last Name
                    </Typography>
                    <Input
                      type="text"
                      placeholder="Doe"
                      inputSize="lg"
                      required
                    />
                  </div>
                </div>

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

                <div>
                  <Typography variant="label" className="mb-2">
                    Password
                  </Typography>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    inputSize="lg"
                    required
                  />
                </div>

                <div>
                  <Typography variant="label" className="mb-2">
                    Confirm Password
                  </Typography>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    inputSize="lg"
                    required
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-text"
                  >
                    I agree to the{" "}
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="h-auto p-0 text-sm"
                    >
                      <Link href="/terms">Terms of Service</Link>
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="h-auto p-0 text-sm"
                    >
                      <Link href="/privacy">Privacy Policy</Link>
                    </Button>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  type="submit"
                >
                  Create Account
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="h-auto p-0"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                </Typography>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

