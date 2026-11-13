"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { testimonials } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Customer testimonial slider.
 *
 * Renders nothing while `testimonials` in src/lib/menu-data.ts is empty, so
 * the site never shows invented or placeholder reviews. Add genuine reviews
 * there and the section appears on its own.
 */
export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;

  const go = useCallback(
    (step: number) => setState(([value]) => [(value + step + total) % total, step]),
    [total],
  );

  if (total === 0) return null;
  const current = testimonials[index];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <section aria-labelledby="testimonials-title" className="relative bg-panel py-24 text-on-panel md:py-36">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div id="testimonials-title" className="lg:col-span-4">
          <SectionHeading eyebrow="Kind words" title="What our customers say." emphasis={["customers"]} onPanel />
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="lg:col-span-7 lg:col-start-6"
        >
          <span aria-hidden className="block font-serif text-[6rem] leading-[0.6] text-panel-accent">
            &ldquo;
          </span>

          <div className="relative mt-2 min-h-[17rem] sm:min-h-[14rem]" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={current.id}
                custom={direction}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -48 }}
                transition={{ duration: 0.55, ease }}
                drag={reduceMotion || total < 2 ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                className="cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <blockquote className="font-serif text-[1.55rem] leading-snug md:text-[2.2rem] md:leading-[1.25]">
                  {current.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="grid size-12 place-items-center rounded-full border border-on-panel/25 font-serif text-lg italic"
                  >
                    {current.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-semibold">{current.name}</span>
                    <span className="block text-[0.8rem] text-on-panel-soft">{current.detail}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-on-panel/15 pt-6">
              <div className="flex items-center gap-2.5">
                {testimonials.map((item, dot) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show testimonial ${dot + 1} of ${total}`}
                    aria-current={dot === index ? "true" : undefined}
                    onClick={() => setState([dot, dot > index ? 1 : -1])}
                    className="group grid h-6 cursor-pointer place-items-center"
                  >
                    <span
                      className={cn(
                        "block h-px transition-[width,background-color] duration-500 ease-[var(--ease-out-soft)]",
                        dot === index ? "w-10 bg-on-panel" : "w-5 bg-on-panel/35 group-hover:bg-on-panel/70",
                      )}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { step: -1, label: "Previous testimonial", Icon: ArrowLeft },
                  { step: 1, label: "Next testimonial", Icon: ArrowRight },
                ].map(({ step, label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => go(step)}
                    className="grid size-11 cursor-pointer place-items-center rounded-full border border-on-panel/30 transition-colors duration-300 hover:border-on-panel hover:bg-on-panel hover:text-panel"
                  >
                    <Icon aria-hidden className="size-4" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
