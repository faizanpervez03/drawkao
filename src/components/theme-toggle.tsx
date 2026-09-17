"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground hover:bg-secondary transition-all"
      aria-label="Toggle theme"
    >
      <span className="hidden dark:block">
        <Sun className="h-4 w-4" weight="fill" />
      </span>
      <span className="block dark:hidden">
        <Moon className="h-4 w-4" weight="fill" />
      </span>
    </button>
  );
}
