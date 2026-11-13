"use client";

import { AnimatedList } from "@/components/animated-list/animated-list";
import { LineGlyph, type GlyphName } from "@/components/ui/line-glyph";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import { images } from "@/lib/images";
import { brandHighlights } from "@/lib/menu-data";
import { SectionHeading } from "./section-heading";

const glyphFor: Record<(typeof brandHighlights)[number]["id"], GlyphName> = {
  "pure-veg": "leaf",
  homemade: "home",
  vaishnav: "bowl",
  hygienic: "drop",
};

type Highlight = (typeof brandHighlights)[number];

function ValueRow({ item, index }: { item: Highlight; index: number }) {
  return (
    <div className="group flex items-center gap-5 rounded-[3px] border border-line bg-surface px-5 py-5 shadow-soft md:gap-6 md:px-7 md:py-6">
      <span className="font-sans text-[0.72rem] tabular-nums tracking-[0.2em] text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-[1.45rem] leading-tight text-ink md:text-[1.8rem]">
          {item.label}
        </p>
        <p className="mt-1.5 text-[0.9rem] text-ink-soft">{item.note}</p>
      </div>
      <LineGlyph
        name={glyphFor[item.id]}
        delay={0.2}
        className="size-10 text-accent-strong md:size-12"
      />
    </div>
  );
}

export function WhyChoose() {
  return (
    <section aria-labelledby="why-title" className="relative py-24 md:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Photography */}
        <div className="relative lg:col-span-5">
          <div className="relative lg:sticky lg:top-28">
            <Reveal>
              <ParallaxImage
                image={images.spices}
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="aspect-[4/5] w-[86%] rounded-[3px]"
              />
            </Reveal>
            <Reveal delay={0.2} className="absolute -bottom-10 right-0 w-[46%] lg:-bottom-14">
              <ParallaxImage
                image={images.vegetables}
                sizes="(min-width: 1024px) 18vw, 44vw"
                strength={5}
                className="aspect-square rounded-[3px] border-[6px] border-bg shadow-lift"
              />
            </Reveal>
          </div>
        </div>

        <div className="pt-10 lg:col-span-6 lg:col-start-7 lg:pt-0">
          <div id="why-title">
            <SectionHeading
              eyebrow="Our promise"
              title="Why Choose Dhara Kitchen?"
              emphasis={["Dhara", "Kitchen?"]}
            />
          </div>

          <Reveal delay={0.1}>
            {/* Height is reserved for all four rows so nothing shifts as they arrive */}
            <div className="mt-12 min-h-[27rem] md:mt-14 md:min-h-[30rem]">
              <AnimatedList delay={700} maxVisible={brandHighlights.length} animationType="slide" loop={false} order="oldest-first">
                {brandHighlights.map((item, index) => (
                  <ValueRow key={item.id} item={item} index={index} />
                ))}
              </AnimatedList>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
