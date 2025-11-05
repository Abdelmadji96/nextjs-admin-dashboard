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
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-5 dark:bg-gray-dark/95 md:px-5 2xl:px-10 border-b border-border/30 shadow-lg shadow-black/5 dark:shadow-black/20">
      <button
        onClick={toggleSidebar}
        className="rounded-xl border border-border/50 px-3 py-2 bg-white/80 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-dark/80 dark:border-border/30 dark:hover:bg-primary/20 lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4 hover:scale-110 transition-transform duration-200">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
            className="drop-shadow-sm"
          />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-heading-5 font-bold text-transparent drop-shadow-sm">
          {pageTitle}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="relative w-full max-w-[300px] group">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-2xl border border-border/30 bg-white/80 dark:bg-gray-dark/80 py-3 pl-[53px] pr-5 outline-none transition-all duration-200 focus-visible:border-primary focus-visible:bg-white dark:focus-visible:bg-gray-dark focus-visible:shadow-lg focus-visible:shadow-primary/10 hover:border-primary/50 hover:shadow-md backdrop-blur-sm"
          />

          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
        </div>

        <ThemeToggleSwitch />

        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
