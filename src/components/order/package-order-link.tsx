import { type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import type { TiffinPackage } from "@/lib/menu-data";
import { buildPackageOrderUrl } from "@/lib/whatsapp";

interface PackageOrderLinkProps {
  item: TiffinPackage;
  children?: ReactNode;
  variant?: Parameters<typeof buttonClass>[0];
  size?: Parameters<typeof buttonClass>[1];
  className?: string;
}

/**
 * Opens WhatsApp with the order message for one tiffin package pre-filled.
 * It is a plain link: nothing is ordered until the customer presses send in
 * WhatsApp and Dhara Kitchen replies.
 */
export function PackageOrderLink({
  item,
  children = "Order This Tiffin",
  variant = "primary",
  size = "md",
  className,
}: PackageOrderLinkProps) {
  return (
    <a
      href={buildPackageOrderUrl(item)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Order ${item.name} on WhatsApp (opens WhatsApp)`}
      className={buttonClass(variant, size, className)}
    >
      <MessageCircle aria-hidden className="size-[1.05rem]" />
      {children}
    </a>
  );
}
