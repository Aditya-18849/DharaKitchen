"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { CursorImageTrail } from "@/components/cursor-image-trail/cursor-image-trail";
import { HoverExpand, type HoverExpandItem } from "@/components/hover-expand/hover-expand";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { trailImages } from "@/lib/images";
import { fifteenDayMenu } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

type View = "rows" | "grid";

const pad = (day: number) => String(day).padStart(2, "0");
const total = fifteenDayMenu.length;

export function FifteenDayMenu() {
  const [view, setView] = useState<View>("rows");

  const items = useMemo<HoverExpandItem[]>(
    () =>
      fifteenDayMenu.map((entry) => ({
        label: entry.dish,
        prefix: `DAY ${pad(entry.day)}`,
        description: `Day ${entry.day} of our ${total}-day special menu.`,
        image: entry.image.src,
        alt: entry.image.alt,
      })),
    [],
  );

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative border-y border-line bg-bg-deep">
      {/* The ingredient trail lives only inside this section, behind the content. */}
      <CursorImageTrail images={trailImages} maxImages={5} distanceThreshold={150} imageSize={70}>
        <div className="container-page grid gap-12 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div id="menu-title">
              <SectionHeading
                eyebrow={`${total} days · ${total} dishes`}
                title="Our 15-Day Special Menu"
                emphasis={["Special"]}
              >
                <p>
                  Enjoy a thoughtfully planned variety of simple homemade vegetarian meals.
                </p>
              </SectionHeading>
            </div>

            <Reveal delay={0.2}>
              <div
                role="group"
                aria-label="Menu layout"
                className="mt-9 inline-flex rounded-full border border-line-strong p-1"
              >
                {(
                  [
                    { id: "rows", label: "Featured", Icon: Rows3 },
                    { id: "grid", label: "Compact list", Icon: LayoutGrid },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view === id}
                    onClick={() => setView(id)}
                    className={cn(
                      "flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-[0.78rem] font-semibold tracking-wide transition-colors duration-300",
                      view === id ? "bg-ink text-bg" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <Icon aria-hidden className="size-3.5" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-6 max-w-xs text-[0.78rem] leading-relaxed text-muted">
                {view === "rows" && (
                  <>
                    <span className="hidden [@media(hover:hover)]:inline">Hover</span>
                    <span className="[@media(hover:hover)]:hidden">Tap</span> a day to open it.{" "}
                  </>
                )}
                Photographs are representative.
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            {view === "rows" ? (
              <HoverExpand items={items} collapsedHeight={64} expandedHeight={300} />
            ) : (
              <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line sm:grid-cols-3">
                {fifteenDayMenu.map((entry) => (
                  <li key={entry.day} className="bg-surface p-4 md:p-5">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-accent-strong">
                      Day {pad(entry.day)}
                    </p>
                    <p className="mt-2 font-serif text-[1.2rem] leading-tight text-ink md:text-[1.35rem]">
                      {entry.dish}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>
        </div>
      </CursorImageTrail>
    </section>
  );
}
