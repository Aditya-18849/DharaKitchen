"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tracks which section is currently in view so the nav can mark it. */
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = navLinks.map((link) => link.href.slice(1));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out-soft)]",
          scrolled || open
            ? "border-b border-line bg-bg/88 shadow-[0_10px_30px_-22px_hsl(var(--shadow-color)/0.5)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "container-page flex items-center justify-between transition-[height] duration-500 ease-[var(--ease-out-soft)]",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <a href="#home" aria-label="Dhara Kitchen — home" className="text-ink" onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active === link.href.slice(1) ? "true" : undefined}
                  className="link-underline font-sans text-[0.84rem] font-medium tracking-wide text-ink/85 transition-colors hover:text-ink aria-[current=true]:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a href="#packages" className={buttonClass("primary", "md", "hidden sm:inline-flex")}>
              Order Now
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line-strong text-ink lg:hidden"
            >
              {open ? <X aria-hidden className="size-[1.1rem]" /> : <Menu aria-hidden className="size-[1.1rem]" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto bg-bg lg:hidden"
          >
            <div className="container-page flex min-h-full flex-col justify-between pb-10 pt-8">
              <ul className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.12 + index * 0.06 }}
                    className="border-b border-line"
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-serif text-[2rem] leading-none text-ink"
                    >
                      {link.label}
                      <span className="font-sans text-[0.7rem] tracking-[0.2em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#packages"
                onClick={() => setOpen(false)}
                className={buttonClass("primary", "lg", "mt-10 w-full")}
              >
                Explore Tiffin Packages
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
