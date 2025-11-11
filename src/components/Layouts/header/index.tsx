"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

// Page title mapping
const PAGE_TITLES: Record<string, string> = {
  "/": "Statistics",
  "/verify-identity": "Verify Identity",
  "/verify-diploma": "Verify Diploma",
  "/verify-user": "Verify User",
  "/support": "Support",
  "/sponsored-courses": "Sponsored Courses",
  "/users": "User Management",
};

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();
  
  // Get page title from pathname
  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-4 dark:bg-gray-dark/95 md:px-5 md:py-5 2xl:px-10 border-b border-border/30 shadow-lg shadow-black/5 dark:shadow-black/20">
      {/* Left Section: Burger Menu + Logo */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Burger Menu Button - Enhanced clickability */}
        <button
          onClick={toggleSidebar}
          type="button"
          aria-label="Toggle Sidebar"
          className="relative z-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-white/80 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md active:scale-95 dark:bg-gray-dark/80 dark:border-border/30 dark:hover:bg-primary/20 min-[850px]:hidden"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {/* Mobile Logo */}
        {isMobile && (
          <Link 
            href={"/"} 
            className="shrink-0 transition-transform duration-200 hover:scale-110 max-[430px]:hidden"
          >
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={32}
              height={32}
              alt="Logo"
              className="drop-shadow-sm"
            />
          </Link>
        )}

        {/* Desktop Page Title */}
        <div className="hidden xl:block">
          <h1 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-heading-5 font-bold text-transparent drop-shadow-sm whitespace-nowrap">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Section: Search + Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-3 md:gap-4">
        {/* Search Input - Responsive */}
        <div className="relative w-full max-w-[280px] group md:max-w-[320px]">
          <input
            type="search"
            placeholder="Search"
            className="flex h-10 w-full items-center gap-3.5 rounded-2xl border border-border/30 bg-white/80 py-2 pl-11 pr-4 text-sm outline-none transition-all duration-200 backdrop-blur-sm hover:border-primary/50 hover:shadow-md focus-visible:border-primary focus-visible:bg-white focus-visible:shadow-lg focus-visible:shadow-primary/10 dark:bg-gray-dark/80 dark:focus-visible:bg-gray-dark md:h-11 md:pl-[53px] md:pr-5 md:py-3"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary md:left-5 md:h-5 md:w-5" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <ThemeToggleSwitch />
          <Notification />
          <div className="shrink-0">
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  );
}
