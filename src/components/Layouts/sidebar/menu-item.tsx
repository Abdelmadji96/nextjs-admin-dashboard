import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const menuItemBaseStyles = cva(
  "group rounded-xl px-3.5 font-medium transition-all duration-300 relative overflow-hidden backdrop-blur-sm border border-transparent hover:border-primary/20",
  {
    variants: {
      isActive: {
        true: "bg-gradient-to-r from-primary to-primary-button text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] border-primary/30",
        false:
          "text-dark-4 dark:text-dark-6 hover:bg-white/60 hover:text-primary hover:shadow-md dark:hover:bg-gray-dark/60 dark:hover:text-white hover:scale-[1.01] active:scale-[0.99]",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        // Close sidebar on clicking link if it's mobile
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            className: "relative block py-3",
          }),
          props.className,
        )}
      >
        {/* Active indicator */}
        {props.isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-r-full shadow-md animate-pulse" />
        )}
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={cn(
        menuItemBaseStyles({
          isActive: props.isActive,
          className: "flex w-full items-center gap-3 py-3",
        }),
        props.className,
      )}
    >
      {/* Active indicator for expandable items */}
      {props.isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-r-full shadow-md animate-pulse" />
      )}
      {props.children}
    </button>
  );
}
