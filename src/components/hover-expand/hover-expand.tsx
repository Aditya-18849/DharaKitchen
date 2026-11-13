"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export interface HoverExpandItem {
  label: string;
  /** Text shown before the label; defaults to the row number ("01"). */
  prefix?: string;
  sublabel?: string;
  description?: string;
  image: string;
  alt?: string;
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  /** Height of a collapsed row in px. */
  collapsedHeight?: number;
  /** Height of the expanded row in px. */
  expandedHeight?: number;
  defaultActive?: number;
  className?: string;
  onActiveChange?: (index: number) => void;
  /** Optional action rendered inside the expanded row (e.g. an order button). */
  renderAction?: (item: HoverExpandItem, index: number) => ReactNode;
}

const spring: Transition = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 };

/**
 * HoverExpand — a stack of image rows; the active row springs open.
 * Hover expands on pointer devices, tap expands on touch, and the rows are
 * real buttons so focus / arrow keys work from the keyboard.
 */
export function HoverExpand({
  items,
  collapsedHeight = 75,
  expandedHeight = 340,
  defaultActive = 0,
  className,
  onActiveChange,
  renderAction,
}: HoverExpandProps) {
  const [active, setActive] = useState(defaultActive);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = useCallback(
    (index: number) => {
      setActive((current) => {
        if (current !== index) onActiveChange?.(index);
        return index;
      });
    },
    [onActiveChange],
  );

  // Hover intent. When a row opens, the rows below slide under a stationary
  // cursor and the browser reports that as hover — in a long list this would
  // cascade down the stack. So a row only opens when the pointer has really
  // moved, and not while the previous change is still settling.
  const lastPointer = useRef({ x: -1, y: -1 });
  const lastSwitch = useRef(0);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>, index: number) => {
    if (event.pointerType !== "mouse") return;
    const moved =
      event.clientX !== lastPointer.current.x || event.clientY !== lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    if (!moved || index === active) return;
    const now = performance.now();
    if (now - lastSwitch.current < 320) return;
    lastSwitch.current = now;
    activate(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next === null) return;
    event.preventDefault();
    triggers.current[next]?.focus();
  };

  const transition: Transition = reduceMotion ? { duration: 0 } : spring;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {items.map((item, index) => {
        const isActive = index === active;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <motion.div
            key={item.label}
            initial={false}
            animate={{ height: isActive ? expandedHeight : collapsedHeight }}
            transition={transition}
            onPointerMove={(event) => onPointerMove(event, index)}
            className="group relative w-full overflow-hidden rounded-[3px] bg-panel"
            style={{ willChange: "height" }}
          >
            {/* Image keeps its full size; the row height reveals it. */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
              style={{ height: expandedHeight }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: isActive ? 1 : 1.12 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={item.image}
                  alt={item.alt ?? item.label}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Dark overlays keep the text readable in both states. */}
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-[#141a12]"
              initial={false}
              animate={{ opacity: isActive ? 0.12 : 0.58 }}
              transition={{ duration: 0.5 }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0d120b]/85 via-[#0d120b]/20 to-transparent"
            />

            <button
              ref={(node) => {
                triggers.current[index] = node;
              }}
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              onClick={() => activate(index)}
              onFocus={() => activate(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-4px] focus-visible:outline-[#f8f3e9]"
            >
              <span className="sr-only">
                {item.label}
                {item.sublabel ? ` — ${item.sublabel}` : ""}
              </span>
            </button>

            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between text-[#f8f3e9]">
              <div
                className="flex shrink-0 items-center justify-between gap-4 px-5 md:px-7"
                style={{ height: collapsedHeight }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="shrink-0 font-sans text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-[#f8f3e9]/75">
                    {item.prefix ?? String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl leading-none md:text-[1.75rem]">
                    {item.label}
                  </span>
                </div>
                {item.sublabel && (
                  <span className="font-sans text-[0.65rem] font-semibold tracking-[0.24em] text-[#f8f3e9]/85">
                    {item.sublabel}
                  </span>
                )}
              </div>

              <motion.div
                id={panelId}
                role="region"
                aria-label={item.label}
                aria-hidden={!isActive}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 14 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.45, delay: isActive ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }
                }
                className="flex flex-wrap items-end justify-between gap-4 px-5 pb-6 md:px-7 md:pb-7"
              >
                {item.description && (
                  <p className="max-w-sm font-sans text-[0.95rem] leading-relaxed text-[#f8f3e9]/90">
                    {item.description}
                  </p>
                )}
                {renderAction && (
                  <div className={cn(isActive ? "pointer-events-auto" : "pointer-events-none")}>
                    {isActive ? renderAction(item, index) : null}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
