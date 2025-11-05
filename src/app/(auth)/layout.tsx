import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Hirini",
    default: "Login - Hirini",
  },
  description: "Sign in to access your Hirini professional career development platform",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}

