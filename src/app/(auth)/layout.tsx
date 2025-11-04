import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Dashboard",
    default: "Authentication",
  },
  description: "Sign in to access your dashboard",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}

