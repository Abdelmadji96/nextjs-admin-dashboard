import "@/css/satoshi.css";
import "./globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Hirini - Professional Career Development",
    default: "Hirini - Professional Career Development Platform",
  },
  description:
    "Create professional CVs, verify credentials, and advance your career with Hirini's comprehensive development platform.",
  icons: {
    icon: "/images/logos/hirini.webp",
    shortcut: "/images/logos/hirini.webp",
    apple: "/images/logos/hirini.webp",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
