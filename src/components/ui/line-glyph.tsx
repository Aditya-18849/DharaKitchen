"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Hand-drawn style line illustrations on a 56-unit grid. */
const glyphs = {
  // Steam rising from a bowl
  bowl: [
    "M10 30h36a18 18 0 0 1-36 0Z",
    "M20 20c-3-4 2-5 0-9",
    "M29 20c-3-4 2-5 0-9",
    "M38 20c-3-4 2-5 0-9",
  ],
  // A home with a heart
  home: [
    "M8 27 28 10l20 17",
    "M13 24v22h30V24",
    "M28 41c-4-3-7-6-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 3-3 6-7 9Z",
  ],
  // Water drop with a sparkle
  drop: [
    "M26 9c7 8 12 15 12 21a12 12 0 0 1-24 0c0-6 5-13 12-21Z",
    "M21 31a5 5 0 0 0 5 6",
    "M45 8v8",
    "M41 12h8",
  ],
  // Stacked tiffin carrier
  tiffin: [
    "M16 20h24v8H16z",
    "M16 28h24v8H16z",
    "M16 36h24v9H16z",
    "M21 20v-5a7 7 0 0 1 14 0v5",
    "M12 20v25",
    "M44 20v25",
  ],
  // Cooking pot
  pot: [
    "M12 24h32v12a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10Z",
    "M7 24h42",
    "M22 16c-2-3 2-4 0-7",
    "M33 16c-2-3 2-4 0-7",
  ],
  // Leaf
  leaf: ["M12 44C12 24 24 12 46 10c0 22-12 34-34 34Z", "M12 44 36 20", "M22 34h10", "M28 28v-8"],
  // Rupee coin
  coin: [
    "M28 8a20 20 0 1 0 0 40 20 20 0 0 0 0-40Z",
    "M21 19h14",
    "M21 25h14",
    "M21 19c9 0 9 12 0 12l10 10",
  ],
} as const;

export type GlyphName = keyof typeof glyphs;

interface LineGlyphProps {
  name: GlyphName;
  className?: string;
  /** Extra delay before the drawing starts, in seconds. */
  delay?: number;
}

/** A small illustration whose strokes draw themselves when scrolled into view. */
export function LineGlyph({ name, className, delay = 0 }: LineGlyphProps) {
  const reduceMotion = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="0 0 56 56"
      className={cn("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[name].map((d, index) => (
        <motion.path
          key={d}
          d={d}
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 1.1, delay: delay + index * 0.14, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
