"use client";

import {
  Children,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export type AnimatedListAnimation = "spring" | "slide" | "scale" | "fade";

export interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  /** Time between items appearing, in ms. */
  delay?: number;
  /** Maximum number of items visible at once; older items animate out. */
  maxVisible?: number;
  /** Entrance / exit style. */
  animationType?: AnimatedListAnimation;
  /** Keep cycling through the children once the end is reached. */
  loop?: boolean;
  /** Where a new item enters: on top (default) or at the bottom. */
  order?: "newest-first" | "oldest-first";
}

interface Variant {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
}

const variants: Record<AnimatedListAnimation, Variant> = {
  spring: {
    initial: { opacity: 0, scale: 0.86, y: -24 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94, y: 16 },
    transition: { type: "spring", stiffness: 320, damping: 30, mass: 0.9 },
  },
  slide: {
    initial: { opacity: 0, x: 48 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
    transition: { type: "spring", stiffness: 260, damping: 32 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: "spring", stiffness: 380, damping: 26 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * AnimatedList — reveals its children one at a time, newest on top, with
 * AnimatePresence + layout animations. At most `maxVisible` items are shown;
 * the oldest animates out as a new one arrives.
 *
 * The sequence only runs while the list is on screen, and is replaced by a
 * static list when the visitor prefers reduced motion.
 */
export function AnimatedList({
  children,
  className,
  delay = 2200,
  maxVisible = 4,
  animationType = "spring",
  loop = true,
  order = "newest-first",
}: AnimatedListProps) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();

  // `count` = how many items have been revealed so far.
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (reduceMotion || !inView || items.length === 0) return;
    if (!loop && count >= items.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), delay);
    return () => window.clearTimeout(timer);
  }, [count, delay, inView, items.length, loop, reduceMotion]);

  const visible = useMemo(() => {
    if (items.length === 0) return [];
    if (reduceMotion) {
      return items.slice(0, maxVisible).map((node, index) => ({ key: index, node }));
    }
    const result: { key: number; node: ReactNode }[] = [];
    const newest = count - 1;
    for (let n = newest; n >= 0 && result.length < maxVisible; n--) {
      result.push({ key: n, node: items[n % items.length] });
    }
    return order === "oldest-first" ? result.reverse() : result;
  }, [count, items, maxVisible, order, reduceMotion]);

  const variant = variants[animationType];

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-3", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map(({ key, node }) => (
          <motion.div
            key={key}
            layout
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={variant.transition}
            className="w-full"
          >
            {node}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
