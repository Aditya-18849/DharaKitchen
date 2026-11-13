import { type ReactNode } from "react";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  emphasis?: string[];
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
  /** Use panel colours (for headings on the dark green panel). */
  onPanel?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  emphasis,
  children,
  className,
  align = "left",
  size = "md",
  onPanel,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Reveal y={12}>
        <p className={cn("eyebrow", onPanel && "!text-on-panel-soft")}>{eyebrow}</p>
      </Reveal>
      <h2
        className={cn(
          "mt-5",
          onPanel ? "text-on-panel" : "text-ink",
          size === "lg"
            ? "text-[clamp(2.4rem,5.6vw,4.75rem)]"
            : "text-[clamp(2.1rem,4.4vw,3.6rem)]",
          // Keep after the font size: tailwind-merge drops an earlier leading-*.
          "leading-[1.04]",
        )}
      >
        <RevealText
          text={title}
          emphasis={emphasis}
          emphasisClassName={onPanel ? "text-panel-accent" : undefined}
        />
      </h2>
      {children && (
        <Reveal delay={0.15}>
          <div
            className={cn(
              "mt-6 max-w-xl text-[1.02rem] leading-relaxed",
              onPanel ? "text-on-panel-soft" : "text-ink-soft",
              align === "center" && "mx-auto",
            )}
          >
            {children}
          </div>
        </Reveal>
      )}
    </div>
  );
}
