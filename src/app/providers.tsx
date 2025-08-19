"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
