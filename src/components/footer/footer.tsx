import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { OrnamentBorder, TulsiDivider } from "@/components/ui/ornament";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice, tiffinPackages } from "@/lib/menu-data";
import { navLinks, PLACEHOLDER_TEXT, siteConfig } from "@/lib/site-config";
import { buildEnquiryUrl } from "@/lib/whatsapp";

const headingClass = "text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-on-panel-soft";
const linkClass = "link-underline text-[0.95rem] text-on-panel/90 transition-colors hover:text-on-panel";

function ContactRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  const external = href?.startsWith("http");
  return (
    <div>
      <dt className="text-[0.72rem] text-on-panel-soft">{label}</dt>
      <dd className="mt-0.5 text-[0.95rem]">
        {value && href ? (
          <a
            href={href}
            className={linkClass}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {value}
          </a>
        ) : value ? (
          <span className="text-on-panel/90">{value}</span>
        ) : (
          <span className="italic text-on-panel/50">{PLACEHOLDER_TEXT}</span>
        )}
      </dd>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-panel text-on-panel dark:bg-bg-deep">
      <OrnamentBorder className="text-panel-accent/50" />
      <div className="container-page pb-10 pt-20 md:pt-28">
        {/* Closing call to action */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-on-panel/15 pb-14 md:pb-20">
            <div>
              <p className="font-serif text-[1.3rem] italic text-panel-accent">
                {siteConfig.greetingFramed}
              </p>
              <h2 className="mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04]">
                Simple Vaishnav food, <em className="text-panel-accent">freshly made at home.</em>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#packages" className={buttonClass("onPanel", "lg")}>
                Explore Tiffin Packages
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
              <a
                href={buildEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass(
                  "outline",
                  "lg",
                  "border-on-panel/35 text-on-panel hover:border-on-panel hover:bg-on-panel hover:text-panel",
                )}
              >
                <MessageCircle aria-hidden className="size-[1.05rem]" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-12 py-14 sm:grid-cols-2 md:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <a href="#home" aria-label="Dhara Kitchen — back to top">
              <Logo />
            </a>
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-on-panel-soft">
              A pure vegetarian homemade tiffin service — simple Vaishnav food, freshly prepared
              meals and affordable daily tiffin packages.
            </p>
            <TulsiDivider className="mt-7 text-panel-accent" />
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <h3 className={headingClass}>Explore</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tiffin packages" className="lg:col-span-2">
            <h3 className={headingClass}>Tiffins</h3>
            <ul className="mt-5 space-y-3">
              {tiffinPackages.map((item) => (
                <li key={item.id}>
                  <a href="#packages" className={linkClass}>
                    {item.name} — {formatPrice(item.price, siteConfig.currency)}
                  </a>
                </li>
              ))}
              <li>
                <a href="#menu" className={linkClass}>
                  15-Day Special Menu
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className={headingClass}>Contact</h3>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-[0.72rem] text-on-panel-soft">Order on WhatsApp</dt>
                <dd className="mt-0.5">
                  <a
                    href={buildEnquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} inline-flex items-center gap-2`}
                  >
                    <MessageCircle aria-hidden className="size-4" />
                    Message us
                  </a>
                </dd>
              </div>
              <ContactRow
                label="Phone"
                value={siteConfig.phone}
                href={siteConfig.phone ? `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}` : undefined}
              />
              <ContactRow
                label="Email"
                value={siteConfig.email}
                href={siteConfig.email ? `mailto:${siteConfig.email}` : undefined}
              />
              <ContactRow label="Kitchen address" value={siteConfig.address} />
              <ContactRow label="Service hours" value={siteConfig.serviceHours} />
              <ContactRow
                label="Instagram"
                value={siteConfig.instagramUrl ? "Follow us on Instagram" : null}
                href={siteConfig.instagramUrl ?? undefined}
              />
              {siteConfig.facebookUrl && (
                <ContactRow label="Facebook" value="Find us on Facebook" href={siteConfig.facebookUrl} />
              )}
            </dl>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-on-panel/15 pt-7 text-[0.78rem] text-on-panel-soft">
          <p>
            &copy; {year} {siteConfig.name}. 100% pure vegetarian.
          </p>
          <a href="#home" className="link-underline">
            Back to top
          </a>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the footer edge */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] select-none text-center font-serif text-[23vw] leading-[0.8] tracking-[-0.03em] text-on-panel/[0.06]"
      >
        Dhara
      </p>
    </footer>
  );
}
