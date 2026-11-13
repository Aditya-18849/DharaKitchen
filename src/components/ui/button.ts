import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "onImage" | "onPanel";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-sans font-semibold tracking-wide transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-on-accent shadow-[0_10px_24px_-12px_var(--accent-strong)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_var(--accent-strong)]",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-bg",
  onImage:
    "bg-[#f8f3e9] text-[#263d2b] hover:bg-white hover:-translate-y-0.5",
  onPanel:
    "bg-on-panel text-panel hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.6)]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.82rem]",
  lg: "h-[3.25rem] px-7 text-[0.9rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
