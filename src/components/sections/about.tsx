import { buttonClass } from "@/components/ui/button";
import { TulsiDivider } from "@/components/ui/ornament";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Reveal } from "@/components/ui/reveal";
import { images } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "./section-heading";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="About Dhara Kitchen"
          title="Simple Food. Pure Intentions. Homemade Love."
          emphasis={["Pure", "Love"]}
          size="lg"
          className="max-w-5xl"
        />

        <div className="mt-14 grid items-end gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-7">
            <Reveal>
              <ParallaxImage
                image={images.cooking}
                sizes="(min-width: 1024px) 56vw, 92vw"
                className="aspect-[16/11] rounded-[3px]"
              />
            </Reveal>
            <Reveal delay={0.15} className="absolute -bottom-10 right-4 w-[34%] md:right-8 lg:-bottom-14">
              <ParallaxImage
                image={images.rotiOnTawa}
                sizes="(min-width: 1024px) 20vw, 34vw"
                strength={6}
                className="aspect-[4/5] rounded-[3px] border-[6px] border-bg shadow-lift"
              />
            </Reveal>
          </div>

          <div className="pt-8 lg:col-span-4 lg:col-start-9 lg:pt-0">
            <Reveal>
              <p className="font-serif text-[1.45rem] leading-snug text-ink md:text-[1.7rem]">
                At Dhara Kitchen, we believe in the comfort of simple homemade vegetarian food.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[1rem] leading-relaxed text-ink-soft">
                Our tiffin packages bring together everyday meals with familiar flavours and the
                warmth of home.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 text-accent-strong">
                <TulsiDivider />
                <p className="mt-5 font-serif text-[1.5rem] italic">{siteConfig.greetingFramed}</p>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a href="#packages" className={buttonClass("primary")}>
                  Explore Tiffin Packages
                </a>
                <a href="#menu" className="link-underline text-[0.86rem] font-semibold tracking-wide text-ink">
                  View 15-Day Menu
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
