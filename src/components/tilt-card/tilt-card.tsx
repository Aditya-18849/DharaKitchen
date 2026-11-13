"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  maxTilt?: number;
  /** CSS perspective in px. */
  perspective?: number;
  /** Scale applied while hovered. */
  hoverScale?: number;
  /** Soft light that follows the cursor. */
  glare?: boolean;
  /** Force-disable the tilt (it is always off on touch / reduced motion). */
  disabled?: boolean;
}

const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * TiltCard — a 3D perspective card that leans toward the cursor and springs
 * back on leave. Children can add depth with `style={{ transform:
 * "translateZ(40px)" }}` (the card preserves 3D).
 *
 * On touch devices and for reduced-motion users the card stays flat.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 7,
  perspective = 1100,
  hoverScale = 1.015,
  glare = true,
  disabled = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const active = !disabled && finePointer && !reduceMotion;

  // Pointer position within the card, normalised to -0.5 … 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const scale = useSpring(useTransform(hover, [0, 1], [1, hoverScale]), springConfig);

  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(hover, { stiffness: 160, damping: 24 });
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255, 244, 222, 0.22), transparent 60%)`;

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
    hover.set(1);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  return (
    <div style={{ perspective }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          active
            ? { rotateX, rotateY, scale, transformStyle: "preserve-3d" }
            : undefined
        }
        className={cn("relative h-full will-change-transform", className)}
      >
        {children}
        {active && glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
            style={{ background: glareBackground, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}
