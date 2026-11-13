"use client";

import Image from "next/image";
import { PackageOrderLink } from "@/components/order/package-order-link";
import { SectionHeading } from "@/components/sections/section-heading";
import { TiltCard } from "@/components/tilt-card/tilt-card";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice, tiffinPackages, type TiffinPackage } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function PackageCard({ item }: { item: TiffinPackage }) {
  const featured = Boolean(item.badge);

  return (
    <TiltCard
      className={cn(
        "group flex flex-col rounded-[4px] border bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift",
        featured ? "border-accent" : "border-line",
      )}
    >
      {/* Photograph floats a little above the card for depth */}
      <div
        className="relative m-3 aspect-[4/3] overflow-hidden rounded-[2px] bg-surface-2"
        style={{ transform: "translateZ(38px)" }}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 92vw"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.07]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#10160d]/55 via-transparent to-transparent" />
        {item.badge && (
          <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#24231f]">
            {item.badge}
          </span>
        )}
        {/* Price sits on the photograph so it is the first thing read */}
        <p
          className="absolute bottom-3 right-3 flex items-baseline gap-1 rounded-full bg-[#f8f3e9] px-4 py-1.5 text-[#263d2b] shadow-soft"
          aria-label={`Price ${formatPrice(item.price, siteConfig.currency)}`}
        >
          <span className="font-serif text-[1.9rem] leading-none">
            {formatPrice(item.price, siteConfig.currency)}
          </span>
        </p>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-3" style={{ transform: "translateZ(20px)" }}>
        <h3 className="text-[2rem] leading-none text-ink">{item.name}</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{item.description}</p>

        <p className="mt-6 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted">
          What&rsquo;s inside
        </p>
        <ul className="mb-7 mt-3 divide-y divide-line border-y border-line">
          {item.contents.map((line) => (
            <li key={line} className="flex items-center gap-3 py-2.5 text-[0.98rem] text-ink">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
              {line}
            </li>
          ))}
        </ul>

        <PackageOrderLink item={item} size="lg" className="mt-auto w-full" />
      </div>
    </TiltCard>
  );
}

export function TiffinPackages() {
  return (
    <section id="packages" className="relative py-24 md:py-36">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Tiffin Packages"
            title="Three simple tiffins, honestly priced."
            emphasis={["honestly"]}
          >
            <p>
              Choose the meal that suits you. Every tiffin is pure vegetarian and freshly prepared,
              with a bowl of curry or sabzi and pickle.
            </p>
          </SectionHeading>
          <Reveal delay={0.2}>
            <p className="max-w-[17rem] border-l border-line-strong pl-4 text-[0.82rem] leading-relaxed text-muted">
              Tap <em>Order This Tiffin</em> and WhatsApp opens with your order written out, ready
              to send.
            </p>
          </Reveal>
        </div>

        <ul className="mx-auto mt-14 grid max-w-md gap-7 md:mt-20 lg:max-w-none lg:grid-cols-3">
          {tiffinPackages.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 0.08} className="h-full">
              <PackageCard item={item} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
