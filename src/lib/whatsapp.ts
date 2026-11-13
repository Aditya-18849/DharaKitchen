import { formatPrice, type TiffinPackage } from "./menu-data";
import { siteConfig } from "./site-config";

/**
 * Builds the pre-filled WhatsApp message for a tiffin package, e.g.
 *
 *   Hare Krishna 🙏
 *   I would like to order Tiffin 1 (₹65).
 *   Meal:
 *   5 Chapati
 *   1 Bowl Curry / Sabzi
 *   Pickle
 *   Please share the ordering details.
 *   Thank you!
 *
 * Everything comes from the package data, so the message can never drift
 * from what the card shows.
 */
export function buildPackageOrderMessage(item: TiffinPackage): string {
  return [
    siteConfig.greeting,
    `I would like to order ${item.name} (${formatPrice(item.price, siteConfig.currency)}).`,
    "Meal:",
    ...item.contents,
    "Please share the ordering details.",
    "Thank you!",
  ].join("\n");
}

export function buildEnquiryMessage(): string {
  return [
    siteConfig.greeting,
    `I would like to know more about ${siteConfig.name}'s tiffin packages.`,
    "Thank you!",
  ].join("\n");
}

/** True once a real WhatsApp number has been added to site-config.ts. */
export function isWhatsAppConfigured(): boolean {
  return siteConfig.whatsappNumber.replace(/\D/g, "").length >= 8;
}

/**
 * Returns a wa.me deep link with the URL-encoded message pre-filled.
 * Without a configured number, WhatsApp opens and the customer picks the
 * chat — the link still works, it just isn't addressed yet.
 */
export function buildWhatsAppUrl(message: string): string {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number.length >= 8
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export const buildPackageOrderUrl = (item: TiffinPackage) =>
  buildWhatsAppUrl(buildPackageOrderMessage(item));

export const buildEnquiryUrl = () => buildWhatsAppUrl(buildEnquiryMessage());
