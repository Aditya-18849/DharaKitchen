import { cn } from "@/lib/utils";

/** Dhara Kitchen wordmark with a small thali-and-leaf mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="size-9 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="20" r="18.2" />
        <circle cx="20" cy="20" r="13.4" opacity="0.45" />
        {/* leaf */}
        <path d="M20 29c-5.2-2.6-7-7.4-5.2-13.2C19.6 16.4 23.8 19 25 24c.5 2-.2 3.8-1.6 5" />
        <path d="M15.6 17.4c2.4 3 4.2 6.6 4.9 11.4" />
        {/* steam */}
        <path d="M25 13.4c-1-1.2.9-2.2-.1-3.6" className="text-accent" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.32rem] tracking-[-0.01em]">Dhara</span>
        <span className="mt-[3px] font-sans text-[0.56rem] font-semibold tracking-[0.42em] opacity-75">
          KITCHEN
        </span>
      </span>
    </span>
  );
}
