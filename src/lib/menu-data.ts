/**
 * DHARA KITCHEN — OFFICIAL CLIENT DATA
 * ------------------------------------------------------------------
 * The tiffin packages, prices, contents and the 15-day menu below were
 * supplied by the client. This file is the single source of truth: the
 * package cards, the 15-day menu, the FAQ and the WhatsApp order messages
 * are all generated from it.
 *
 * DO NOT change prices, quantities, dish names or their order without the
 * client's confirmation.
 */

import { images, type SiteImage } from "./images";

/* ------------------------------------------------------------------ */
/* Tiffin packages (client-confirmed)                                  */
/* ------------------------------------------------------------------ */

export interface TiffinPackage {
  id: string;
  name: string;
  /** Price in Indian Rupees. */
  price: number;
  description: string;
  /** Exactly what the tiffin contains, in the client's wording. */
  contents: string[];
  image: SiteImage;
  /** Optional factual label shown on the card. */
  badge?: string;
}

export const tiffinPackages: TiffinPackage[] = [
  {
    id: "tiffin-1",
    name: "Tiffin 1",
    price: 65,
    description: "A simple and satisfying homemade meal.",
    contents: ["5 Chapati", "1 Bowl Curry / Sabzi", "Pickle"],
    image: images.chapatiMeal,
  },
  {
    id: "tiffin-2",
    name: "Tiffin 2",
    price: 80,
    description: "A wholesome rice-based homemade meal.",
    contents: ["2 Bowls Rice", "1 Bowl Curry / Sabzi", "Pickle"],
    image: images.riceMeal,
  },
  {
    id: "tiffin-3",
    name: "Tiffin 3",
    price: 90,
    description: "A complete homemade meal with chapati and rice.",
    contents: ["3 Chapati", "1 Bowl Rice", "1 Bowl Curry / Sabzi", "Pickle"],
    image: images.completeThali,
    badge: "Complete meal",
  },
];

/* ------------------------------------------------------------------ */
/* 15-day special menu (client-confirmed, in this exact order)         */
/* ------------------------------------------------------------------ */

export interface MenuDay {
  day: number;
  dish: string;
  /** Representative photograph — see src/lib/images.ts. */
  image: SiteImage;
}

export const fifteenDayMenu: MenuDay[] = [
  { day: 1, dish: "Toor Dal", image: images.dalTadka },
  { day: 2, dish: "Aloo Gobhi", image: images.alooGobhi },
  { day: 3, dish: "Aloo Matar", image: images.potatoCurry },
  { day: 4, dish: "Masoor Dal", image: images.dalBowl },
  { day: 5, dish: "Black Channa", image: images.blackChanna },
  { day: 6, dish: "Aloo & Mix Veg", image: images.mixVeg },
  { day: 7, dish: "Hari Moong Dal", image: images.greenDal },
  { day: 8, dish: "Soyabean Curry", image: images.vegStew },
  { day: 9, dish: "Channa Dal", image: images.chanaDalGrains },
  { day: 10, dish: "Aloo Beans", image: images.spicedPotatoes },
  { day: 11, dish: "White Rajma", image: images.beans },
  { day: 12, dish: "Sabut Masoor Dal", image: images.dalPot },
  { day: 13, dish: "Mix Dal", image: images.mixedPulses },
  { day: 14, dish: "Black Rajma", image: images.rajmaRice },
  { day: 15, dish: "Pumpkin / Lauki", image: images.pumpkinCurry },
];

/* ------------------------------------------------------------------ */
/* Brand values (client-confirmed)                                     */
/* ------------------------------------------------------------------ */

export const brandHighlights = [
  {
    id: "pure-veg",
    label: "100% Pure Vegetarian",
    note: "Everything we cook is vegetarian.",
  },
  {
    id: "homemade",
    label: "Fresh Homemade Food",
    note: "Freshly prepared, the homemade way.",
  },
  {
    id: "vaishnav",
    label: "Simple Vaishnav Food",
    note: "Simple meals with familiar flavours.",
  },
  {
    id: "hygienic",
    label: "Healthy & Hygienic",
    note: "Prepared with care and cleanliness.",
  },
] as const;

export function formatPrice(price: number, currency: string): string {
  return `${currency}${price.toLocaleString("en-IN")}`;
}

/* ------------------------------------------------------------------ */
/* From our kitchen to your table                                      */
/* ------------------------------------------------------------------ */

export const storySteps = [
  {
    number: "01",
    title: "Fresh Ingredients",
    body: "Every meal starts with fresh vegetables, grains and spices.",
    image: images.vegetables,
  },
  {
    number: "02",
    title: "Thoughtful Preparation",
    body: "Simple vegetarian food, cooked the homemade way.",
    image: images.rotiOnTawa,
  },
  {
    number: "03",
    title: "Carefully Packed",
    body: "Your tiffin is packed neatly and with care.",
    image: images.containers,
  },
  {
    number: "04",
    title: "Delivered to You",
    body: "A homemade meal, ready to open and enjoy.",
    image: images.chapatiMeal,
  },
] as const;

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* None have been provided yet, so the section is not rendered.        */
/* Add genuine customer reviews here and it appears automatically.     */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  detail: string;
}

export const testimonials: Testimonial[] = [];

/* ------------------------------------------------------------------ */
/* FAQ — answers are built from the data above. Delivery areas,        */
/* timings and customisation are NOT confirmed, so those answers point */
/* to WhatsApp instead of guessing.                                    */
/* ------------------------------------------------------------------ */

const packageSummary = tiffinPackages
  .map((item) => `${item.name} (₹${item.price}) — ${item.contents.join(", ")}`)
  .join(". ");

export const faqs = [
  {
    question: "What kind of food do you serve?",
    answer:
      "Dhara Kitchen is 100% pure vegetarian. We prepare simple, homemade Vaishnav food — fresh, healthy and hygienic.",
  },
  {
    question: "Which tiffin packages do you offer?",
    answer: `We offer three tiffin packages. ${packageSummary}.`,
  },
  {
    question: "What is on the menu?",
    answer: `We follow a ${fifteenDayMenu.length}-day special menu, from ${fifteenDayMenu[0].dish} on Day 1 to ${fifteenDayMenu[fifteenDayMenu.length - 1].dish} on Day ${fifteenDayMenu.length}. The full list is in the menu section above.`,
  },
  {
    question: "How can I place an order?",
    answer:
      "Tap “Order This Tiffin” on the package you’d like. WhatsApp opens with your order message ready — send it, and we’ll reply with the ordering details.",
  },
  {
    question: "Which locations do you deliver to?",
    answer:
      "Please message us on WhatsApp with your location and we’ll let you know whether we can deliver to you.",
  },
  {
    question: "Can I customize my meal?",
    answer:
      "Please ask us on WhatsApp when you order and we’ll let you know what is possible.",
  },
];
