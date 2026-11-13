"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
      aria-pressed={isDark}
      title={isDark ? "Day theme" : "Night theme"}
      className={cn(
        "relative grid size-10 cursor-pointer place-items-center overflow-hidden rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduceMotion ? false : { y: 16, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: -16, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {isDark ? <Sun aria-hidden className="size-[1.05rem]" /> : <Moon aria-hidden className="size-[1.05rem]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
