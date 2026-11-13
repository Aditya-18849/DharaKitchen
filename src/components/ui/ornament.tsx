import { cn } from "@/lib/utils";

/** A small tulsi sprig, used sparingly as the brand's decorative motif. */
export function TulsiSprig({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 46V22" />
      <path d="M24 22c-5-3-6-10 0-18 6 8 5 15 0 18Z" />
      <path d="M23 32c-6 0-11-4-13-12 8 0 13 4 13 12Z" />
      <path d="M25 32c6 0 11-4 13-12-8 0-13 4-13 12Z" />
      <path d="M23 41c-5 1-9-1-12-6 6-2 10 0 12 6Z" />
      <path d="M25 41c5 1 9-1 12-6-6-2-10 0-12 6Z" />
    </svg>
  );
}

/** Line — sprig — line. A quiet divider for greetings and section breaks. */
export function TulsiDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span className="h-px w-12 bg-current opacity-40" />
      <TulsiSprig className="size-6" />
      <span className="h-px w-12 bg-current opacity-40" />
    </div>
  );
}

/** Scalloped ornamental border (see `.ornament-border` in globals.css). */
export function OrnamentBorder({ className }: { className?: string }) {
  return <div aria-hidden className={cn("ornament-border w-full", className)} />;
}
