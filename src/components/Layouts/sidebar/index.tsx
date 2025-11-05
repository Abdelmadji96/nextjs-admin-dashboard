"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  }, []);

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }

            // Break the loop
            return true;
          }
        });
      });
    });
  }, [pathname, expandedItems, toggleExpanded]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-gray-dark/95",
          "border-border/30 border-r shadow-2xl shadow-black/5 dark:shadow-black/20",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="relative flex h-full flex-col py-8 pl-6 pr-2">
          {/* Subtle gradient overlay */}
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
          <div className="relative z-10 pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="block px-0 py-2.5 transition-transform duration-200 hover:scale-105 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar relative z-10 mt-8 flex-1 overflow-y-auto pr-3 min-[850px]:mt-12">
            {NAV_DATA.map((section, index) => (
              <div key={section.label} className="mb-6">
                {/* Section Title with Divider */}
                <div className="mb-4">
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </h2>
                  <div className="bg-border/50 h-px" />
                </div>

                {/* Navigation Items */}
                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className={cn(
                                  "size-5 shrink-0 transition-colors duration-200",
                                  item.items.some(({ url }) => url === pathname)
                                    ? "text-white"
                                    : "text-current group-hover:text-primary",
                                )}
                                aria-hidden="true"
                              />

                              <span className="flex-1 text-left">
                                {item.title}
                              </span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto size-4 rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      className="relative pl-4 text-sm before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-2 before:-translate-y-1/2 before:bg-current before:opacity-30"
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                    >
                                      <span className="font-medium">
                                        {subItem.title}
                                      </span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : item.action === "logout" ? (
                          <MenuItem
                            className="flex items-center gap-3"
                            onClick={logout}
                            isActive={false}
                          >
                            <item.icon
                              className="group-hover:text-destructive/80 size-5 shrink-0 text-destructive transition-colors duration-200"
                              aria-hidden="true"
                            />
                            <span className="group-hover:text-destructive/80 flex-1 text-left font-medium text-destructive">
                              {item.title}
                            </span>
                          </MenuItem>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                  item.title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                className="flex items-center gap-3"
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className={cn(
                                    "size-5 shrink-0 transition-colors duration-200",
                                    pathname === href
                                      ? "text-white"
                                      : "text-current group-hover:text-primary",
                                  )}
                                  aria-hidden="true"
                                />

                                <span className="flex-1 text-left font-medium">
                                  {item.title}
                                </span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
