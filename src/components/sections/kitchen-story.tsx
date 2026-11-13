"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { storySteps } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const ease = [0.22, 1, 0.36, 1] as const;

export function KitchenStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // The journey line fills as the steps travel through the viewport.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const fill = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      aria-labelledby="story-title"
      className="relative overflow-hidden bg-panel py-24 text-on-panel md:py-36"
    >
      <div className="container-page">
        <div id="story-title">
          <SectionHeading
            eyebrow="How it reaches you"
            title="From Our Kitchen to Your Table."
            emphasis={["Kitchen", "Table"]}
            size="lg"
            onPanel
          />
        </div>

        <div ref={trackRef} className="relative mt-16 md:mt-24">
          {/* Journey line: vertical on mobile, horizontal on desktop */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span className="absolute bottom-0 left-[5px] top-2 w-px bg-on-panel/15 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[5px] lg:h-px lg:w-auto" />
            <motion.span
              style={reduceMotion ? undefined : { scaleY: fill }}
              className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-panel-accent lg:hidden"
            />
            <motion.span
              style={reduceMotion ? undefined : { scaleX: fill }}
              className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-panel-accent lg:block"
            />
          </div>

          <ol className="relative grid gap-14 pl-9 lg:grid-cols-4 lg:gap-7 lg:pl-0 lg:pt-12">
          {storySteps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 1, ease, delay: index * 0.1 }}
              className={cn("group relative", index % 2 === 1 && "lg:mt-20")}
            >
              {/* Node on the line */}
              <span
                aria-hidden
                className={cn(
                  "absolute -left-9 top-1.5 size-[11px] rounded-full border border-panel-accent bg-panel lg:left-0",
                  index % 2 === 1 ? "lg:-top-32" : "lg:-top-12",
                )}
              />

              <div className="flex items-baseline gap-4">
                <span className="font-serif text-[2.6rem] italic leading-none text-panel-accent md:text-[3.2rem]">
                  {step.number}
                </span>
                <span aria-hidden className="h-px flex-1 bg-on-panel/15" />
              </div>

              <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-[3px] bg-black/20 max-lg:aspect-[16/11]">
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 1.6, ease, delay: 0.1 + index * 0.1 }}
                >
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(min-width: 1024px) 23vw, 88vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  />
                </motion.div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#10160d]/45 to-transparent" />
                {/* Curtain that lifts to reveal the photograph. (The image itself is
                    never clipped, so lazy-loading and in-view detection keep working.) */}
                {!reduceMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 origin-top bg-panel"
                    initial={{ scaleY: 1 }}
                    whileInView={{ scaleY: 0 }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                    transition={{ duration: 1.2, ease, delay: 0.15 + index * 0.1 }}
                  />
                )}
              </div>

              <h3 className="mt-6 text-[1.65rem] leading-tight text-on-panel">{step.title}</h3>
              <p className="mt-2.5 max-w-xs text-[0.95rem] leading-relaxed text-on-panel-soft">
                {step.body}
              </p>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
