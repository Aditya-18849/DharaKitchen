"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface CursorImageTrailProps {
  /** Image URLs cycled through as the cursor moves. */
  images: string[];
  children: ReactNode;
  className?: string;
  /** Maximum number of images on screen at once. */
  maxImages?: number;
  /** Distance in px the cursor must travel before the next image spawns. */
  distanceThreshold?: number;
  /** Rendered size of each image in px. */
  imageSize?: number;
  /** How long each image stays before fading out, in ms. */
  lifetime?: number;
  /** Maximum random rotation in degrees (applied ±). */
  maxRotation?: number;
  /** Force-disable the effect. */
  disabled?: boolean;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotate: number;
  src: string;
}

/**
 * CursorImageTrail — images bloom along the cursor's path inside the wrapped
 * area. The trail layer sits *behind* the content and ignores pointer events,
 * so it can never block text, links or buttons.
 *
 * Automatically inactive on touch devices and when the visitor prefers
 * reduced motion.
 */
export function CursorImageTrail({
  images,
  children,
  className,
  maxImages = 6,
  distanceThreshold = 120,
  imageSize = 76,
  lifetime = 950,
  maxRotation = 14,
  disabled = false,
}: CursorImageTrailProps) {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = !disabled && finePointer && !reduceMotion && images.length > 0;

  const [trail, setTrail] = useState<TrailItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const nextId = useRef(0);
  const imageIndex = useRef(0);
  const timers = useRef(new Set<number>());

  // Clear pending removals on unmount / when the effect is switched off.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, [enabled]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.pointerType !== "mouse") return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const last = lastPoint.current;
      if (last && Math.hypot(x - last.x, y - last.y) < distanceThreshold) return;
      // First movement only records the position, so nothing pops on entry.
      lastPoint.current = { x, y };
      if (!last) return;

      const id = nextId.current++;
      const src = images[imageIndex.current++ % images.length];
      const rotate = (Math.random() * 2 - 1) * maxRotation;

      setTrail((current) => [...current, { id, x, y, rotate, src }].slice(-maxImages));

      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        setTrail((current) => current.filter((item) => item.id !== id));
      }, lifetime);
      timers.current.add(timer);
    },
    [enabled, distanceThreshold, images, lifetime, maxImages, maxRotation],
  );

  const handlePointerLeave = useCallback(() => {
    lastPoint.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={enabled ? handlePointerMove : undefined}
      onPointerLeave={enabled ? handlePointerLeave : undefined}
      className={cn("relative isolate", className)}
    >
      {enabled && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence>
            {trail.map((item) => (
              <motion.img
                key={item.id}
                src={item.src}
                alt=""
                draggable={false}
                width={imageSize}
                height={imageSize}
                initial={{ opacity: 0, scale: 0.4, rotate: item.rotate - 10 }}
                animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
                exit={{ opacity: 0, scale: 0.7, y: 12 }}
                transition={{
                  opacity: { duration: 0.35, ease: "easeOut" },
                  scale: { type: "spring", stiffness: 260, damping: 20 },
                  rotate: { type: "spring", stiffness: 200, damping: 18 },
                  y: { duration: 0.35 },
                }}
                className="absolute select-none drop-shadow-[0_10px_14px_rgba(30,25,15,0.18)]"
                style={{
                  left: item.x - imageSize / 2,
                  top: item.y - imageSize / 2,
                  width: imageSize,
                  height: imageSize,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
