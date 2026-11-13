"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  image: SiteImage;
  className?: string;
  sizes: string;
  /** How far the image drifts inside its frame, in % of its height. */
  strength?: number;
  priority?: boolean;
}

/** A framed photograph that drifts gently inside its frame as the page scrolls. */
export function ParallaxImage({ image, className, sizes, strength = 8, priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-surface-2", className)}>
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-x-0 -inset-y-[10%]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
