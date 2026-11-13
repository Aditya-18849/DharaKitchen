"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical offset the element rises from, in px. */
  y?: number;
  as?: "div" | "li" | "section" | "article";
}

/** Fades + lifts its children into place the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Component>
  );
}

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Animate on mount instead of on scroll (used by the hero). */
  immediate?: boolean;
  /** Words to set in italic accent, matched exactly. */
  emphasis?: string[];
  /** Colour class for emphasised words. */
  emphasisClassName?: string;
}

/** Editorial headline reveal: each word rises out of a clipped line. */
export function RevealText({
  text,
  className,
  delay = 0,
  immediate,
  emphasis = [],
  emphasisClassName = "text-emphasis",
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const target = { y: "0%", opacity: 1 };

  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((word, index) => {
        const isEmphasis = emphasis.includes(word.replace(/[.,]/g, ""));
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.14em] align-bottom"
          >
            <motion.span
              className={cn("inline-block", isEmphasis && "italic", isEmphasis && emphasisClassName)}
              initial={reduceMotion ? false : { y: "105%", opacity: 0 }}
              {...(immediate
                ? { animate: target }
                : { whileInView: target, viewport: { once: true, margin: "0px 0px -10% 0px" } })}
              transition={{ duration: 0.95, delay: delay + index * 0.07, ease }}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
