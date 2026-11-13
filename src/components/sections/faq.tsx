"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { faqs } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { buildEnquiryUrl } from "@/lib/whatsapp";
import { SectionHeading } from "./section-heading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <section aria-labelledby="faq-title" className="relative border-t border-line bg-bg-deep py-24 md:py-36">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div id="faq-title" className="lg:sticky lg:top-32">
            <SectionHeading eyebrow="Questions" title="Good to know before you order." emphasis={["know"]}>
              <p>
                Can&rsquo;t find what you&rsquo;re looking for?{" "}
                <a
                  href={buildEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-semibold text-ink"
                >
                  Ask us on WhatsApp
                </a>
                .
              </p>
            </SectionHeading>
          </div>
        </div>

        <Reveal className="lg:col-span-7 lg:col-start-6">
          <ul className="border-b border-line">
            {faqs.map((faq, index) => {
              const isOpen = open === index;
              const buttonId = `${baseId}-q-${index}`;
              const panelId = `${baseId}-a-${index}`;
              return (
                <li key={faq.question} className="border-t border-line">
                  <h3 className="font-sans">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left md:py-7"
                    >
                      <span
                        className={cn(
                          "font-serif text-[1.3rem] leading-snug transition-colors duration-300 md:text-[1.6rem]",
                          isOpen ? "text-emphasis" : "text-ink group-hover:text-emphasis",
                        )}
                      >
                        {faq.question}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-out-soft)]",
                          isOpen
                            ? "rotate-45 border-ink bg-ink text-bg"
                            : "border-line-strong text-ink group-hover:border-ink",
                        )}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 text-[1rem] leading-relaxed text-ink-soft">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
