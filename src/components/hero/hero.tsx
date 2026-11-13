"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { buttonClass } from "@/components/ui/button";
import { TulsiSprig } from "@/components/ui/ornament";
import { RevealText } from "@/components/ui/reveal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { brandHighlights } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

// three.js is only fetched in the browser, after the text has painted.
const ThaliScene = dynamic(() => import("./thali-scene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isSmall = useMediaQuery("(max-width: 767px)");
  const inView = useInView(stageRef, { amount: 0.05 });
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const fade = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="grain relative isolate overflow-hidden pt-24 lg:min-h-[100svh] lg:pt-0"
    >
      {/* Ambient background: two soft washes of light, no hard shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[18%] top-[-12%] size-[70vw] max-w-[980px] rounded-full bg-[radial-gradient(circle,var(--glow-b),transparent_65%)]" />
        <div className="absolute -left-[20%] bottom-[-30%] size-[60vw] max-w-[820px] rounded-full bg-[radial-gradient(circle,var(--glow-a),transparent_65%)]" />
      </div>

      <div className="container-page relative grid items-center gap-2 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-0">
        {/* Copy */}
        <motion.div
          style={reduceMotion ? undefined : { y: copyY }}
          className="relative z-10 pt-6 lg:col-span-6 lg:pt-20"
        >
          <motion.p
            {...fade(0.15)}
            className="flex items-center gap-3 font-serif text-[1.35rem] italic text-accent-strong md:text-[1.5rem]"
          >
            <TulsiSprig className="size-7" />
            {siteConfig.greeting}
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.6rem,5.3vw,4.7rem)] leading-[1.02] text-ink">
            <RevealText text={siteConfig.tagline} immediate delay={0.25} emphasis={["Homemade"]} />
          </h1>

          <motion.p
            {...fade(0.75)}
            className="mt-7 max-w-md text-[1.06rem] leading-relaxed text-ink-soft md:text-lg"
          >
            Simple Vaishnav food, freshly prepared and delivered with the warmth of a homemade
            meal.
          </motion.p>

          <motion.div {...fade(0.9)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#packages" className={buttonClass("primary", "lg")}>
              Explore Tiffin Packages
            </a>
            <a href="#menu" className={buttonClass("outline", "lg")}>
              View 15-Day Menu
            </a>
          </motion.div>

          <motion.ul
            {...fade(1.05)}
            className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5 text-[0.82rem] font-medium tracking-wide text-ink-soft"
          >
            {brandHighlights.map((item) => (
              <li key={item.id} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* 3D stage */}
        <div className="relative lg:col-span-6 lg:h-full">
          <motion.div
            ref={stageRef}
            style={reduceMotion ? undefined : { y: stageY, scale: stageScale }}
            className="relative mx-auto aspect-square w-[120%] max-w-[680px] -translate-x-[8%] lg:absolute lg:left-[-26%] lg:top-1/2 lg:w-[146%] lg:max-w-none lg:-translate-x-0 lg:-translate-y-[46%]"
          >
            {/* Halo the thali rests on */}
            <motion.div
              aria-hidden
              style={reduceMotion ? undefined : { y: haloY }}
              className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--sage-soft),transparent_70%)]"
            />
            <motion.div
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease, delay: 0.3 }}
              className="absolute inset-[9%] rounded-full border border-line"
            />

            <div
              role="img"
              aria-label="A pure vegetarian Indian thali with fresh chapatis, rice, dal, seasonal sabzi and pickle"
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              <ThaliScene
                active={inView}
                still={reduceMotion}
                lowPower={isSmall}
                onReady={() => setReady(true)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#packages"
        {...fade(1.4)}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted transition-colors hover:text-ink lg:flex"
      >
        Scroll
        <span className="grid size-8 place-items-center rounded-full border border-line-strong">
          <ArrowDown aria-hidden className="size-3.5" />
        </span>
      </motion.a>
    </section>
  );
}
