/**
 * DHARA KITCHEN — SITE CONFIGURATION
 * ------------------------------------------------------------------
 * Brand identity and contact details. Values set to `null` / "" are
 * PLACEHOLDERS the client has not supplied yet; the site shows a neutral
 * "To be confirmed" for them — nothing is invented.
 */

export interface SiteConfig {
  name: string;
  /** Short greeting used in the hero and in WhatsApp messages. */
  greeting: string;
  /** Framed greeting used in the brand story and footer. */
  greetingFramed: string;
  tagline: string;
  /** One-line positioning statement. */
  positioning: string;
  description: string;
  /** Public URL of the deployed site, e.g. "https://dharakitchen.in". */
  url: string | null;
  /**
   * WhatsApp Business number in international format, digits only,
   * e.g. "919876543210" (country code + number, no "+", no spaces).
   *
   * PLACEHOLDER — NOT YET PROVIDED BY THE CLIENT. Leave as "" until it is.
   * While empty, order buttons still open WhatsApp with the order text
   * pre-filled, and the customer has to pick the chat themselves.
   */
  whatsappNumber: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  serviceHours: string | null;
  /** Full profile URLs, e.g. "https://instagram.com/…". */
  instagramUrl: string | null;
  facebookUrl: string | null;
  /** Currency symbol shown in front of prices. */
  currency: string;
}

export const siteConfig: SiteConfig = {
  name: "Dhara Kitchen",
  greeting: "Hare Krishna 🙏",
  greetingFramed: "🙏 Hare Krishna 🙏",
  tagline: "Pure Veg. Homemade. Made with Care.",
  positioning: "Simple Vaishnav Food, Freshly Made at Home.",
  description:
    "Dhara Kitchen is a pure vegetarian homemade tiffin service offering simple Vaishnav food, freshly prepared meals and affordable daily tiffin packages.",
  url: null,
  whatsappNumber: "",
  phone: null,
  email: null,
  address: null,
  serviceHours: null,
  instagramUrl: null,
  facebookUrl: null,
  currency: "₹",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Tiffin Packages", href: "#packages" },
  { label: "15-Day Menu", href: "#menu" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const PLACEHOLDER_TEXT = "To be confirmed";
