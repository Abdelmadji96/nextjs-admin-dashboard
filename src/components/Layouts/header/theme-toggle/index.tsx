import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

const THEMES = [
  {
    name: "light",
    Icon: Sun,
  },
  {
    name: "dark",
    Icon: Moon,
  },
];

export function ThemeToggleSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="group shrink-0 rounded-full bg-gray-3 p-[5px] text-[#111928] outline-1 outline-primary transition-transform duration-200 hover:scale-105 focus-visible:outline active:scale-95 dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {theme === "light" ? "dark" : "light"} mode
      </span>

      <span aria-hidden className="relative flex gap-2 md:gap-2.5">
        {/* Indicator */}
        <span className="absolute h-8 w-8 rounded-full border border-gray-200 bg-white transition-all dark:translate-x-[42px] dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3 md:h-[38px] md:w-[38px] md:dark:translate-x-[48px]" />

        {THEMES.map(({ name, Icon }) => (
          <span
            key={name}
            className={cn(
              "relative grid h-8 w-8 place-items-center rounded-full md:h-[38px] md:w-[38px]",
              name === "dark" && "dark:text-white",
            )}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </span>
        ))}
      </span>
    </button>
  );
}
