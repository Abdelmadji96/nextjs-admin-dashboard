"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, Rocket } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button, Typography, Input, Card } from "@/components/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      // Add your login logic here
      // Example: await signIn(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/others/hirini-3.jpg"
          alt="Hirini Professional Career Development"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="bg-background/50 absolute inset-0" />
      </div>

      <Card
        variant="elevated"
        padding="lg"
        className="w-full max-w-lg bg-white/60 shadow-2xl backdrop-blur-md dark:bg-gray-dark/80"
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logos/hirini.webp"
                alt="Hirini Logo"
                width={180}
                height={60}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <Typography
                variant="h1"
                className="text-center text-3xl font-bold text-text"
              >
                hirinii
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="text-center text-2xl font-semibold text-text"
            >
              Dashboard panel
            </Typography>
            <Typography
              variant="body"
              className="text-center text-text-placeholder"
            >
              Access your professional career development platform
            </Typography>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Typography variant="label" className="text-sm font-medium">
                EMAIL ADDRESS
              </Typography>
              <Input
                type="email"
                placeholder="semih@kamion.co"
                inputSize="lg"
                className="w-full"
                {...register("email")}
                variant={errors.email ? "error" : "default"}
              />
              {errors.email && (
                <Typography
                  variant="bodySmall"
                  className="mt-1 text-destructive"
                >
                  {errors.email.message}
                </Typography>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Typography variant="label" className="text-sm font-medium">
                PASSWORD
              </Typography>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 numeric characters"
                  inputSize="lg"
                  className="w-full pr-12"
                  {...register("password")}
                  variant={errors.password ? "error" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder transition-colors hover:text-text"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <Typography
                  variant="bodySmall"
                  className="mt-1 text-destructive"
                >
                  {errors.password.message}
                </Typography>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-start">
              <Button
                variant="link"
                size="sm"
                asChild
                className="h-auto p-0 text-primary hover:text-primary-bold"
              >
                <Link href="/forgot-password">Forgot Password?</Link>
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
