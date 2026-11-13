import { PackageOrderLink } from "@/components/order/package-order-link";
import { SectionHeading } from "@/components/sections/section-heading";
import { OrnamentBorder } from "@/components/ui/ornament";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice, tiffinPackages } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

const steps = [
  {
    title: "Choose your tiffin",
    body: "Pick the package that suits your meal.",
  },
  {
    title: "Send the message",
    body: "WhatsApp opens with your order already written. Just press send.",
  },
  {
    title: "We reply with the details",
    body: "We’ll share the ordering details with you on WhatsApp.",
  },
];

/** Conversion section: how ordering works + a quick-order row per package. */
export function OrderSection() {
  return (
    <section id="order" className="relative bg-panel text-on-panel">
      <OrnamentBorder className="text-panel-accent/50" />
      <div className="container-page py-24 md:py-32">
        <SectionHeading
          eyebrow="Order on WhatsApp"
          title="Make Every Day a Little More Homemade."
          emphasis={["Homemade"]}
          size="lg"
          onPanel
        />

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* How it works */}
          <ol className="lg:col-span-5">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.08}>
                <div className="flex gap-6 border-t border-on-panel/15 py-7">
                  <span className="font-serif text-[2.4rem] italic leading-none text-panel-accent">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.5rem] leading-tight">{step.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-on-panel-soft">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Quick order */}
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <ul className="rounded-[4px] border border-on-panel/15 bg-on-panel/[0.05]">
              {tiffinPackages.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-on-panel/15 p-6 last:border-b-0 md:p-7"
                >
                  <div className="min-w-0">
                    <p className="flex items-baseline gap-3">
                      <span className="font-serif text-[1.7rem] leading-none">{item.name}</span>
                      <span className="font-serif text-[1.7rem] leading-none text-panel-accent">
                        {formatPrice(item.price, siteConfig.currency)}
                      </span>
                    </p>
                    <p className="mt-2 text-[0.9rem] text-on-panel-soft">
                      {item.contents.join(" · ")}
                    </p>
                  </div>
                  <PackageOrderLink item={item} variant="onPanel">
                    Order {item.name}
                  </PackageOrderLink>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.8rem] leading-relaxed text-on-panel-soft">
              Opening WhatsApp does not place an order by itself — your order is confirmed only
              once we reply to your message.
            </p>
            {process.env.NODE_ENV === "development" && !isWhatsAppConfigured() && (
              <p className="mt-4 border border-dashed border-panel-accent px-3 py-2 text-[0.75rem] text-panel-accent">
                Developer note (not shown in production): no WhatsApp number is configured yet.
                Set <code>whatsappNumber</code> in <code>src/lib/site-config.ts</code>. Until then
                order links open WhatsApp without a recipient.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
