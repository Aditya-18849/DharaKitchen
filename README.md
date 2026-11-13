# Dhara Kitchen

Website for Dhara Kitchen — a pure vegetarian homemade tiffin service (simple Vaishnav food).
Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion · React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where the client's information lives

| What | File | Status |
| --- | --- | --- |
| Tiffin packages (names, prices, contents), 15-day menu, brand values, FAQ, testimonials | `src/lib/menu-data.ts` | Packages, menu and values are client-confirmed. Testimonials are empty, so that section is hidden until real ones are added. |
| Brand name, greeting, WhatsApp number, phone, email, address, hours, social links, site URL | `src/lib/site-config.ts` | **WhatsApp number and all contact details are still placeholders** (`""` / `null`). Empty values show as "To be confirmed". |
| Photography | `src/lib/images.ts` | Free-licence Unsplash placeholders, all vegetarian. The 15-day menu photos are representative, not Dhara Kitchen's own dishes. Replace with real photos in `public/images/`. |

The package cards, the 15-day menu, the FAQ answers and the WhatsApp messages are all generated
from `menu-data.ts`, so a price or dish only ever needs changing in one place.

### Before going live

1. Set `whatsappNumber` in `site-config.ts` — digits only with country code, e.g. `919876543210`.
   Until then, order buttons open WhatsApp without a recipient.
2. Set `url` (used for social-share images) and fill in the contact details.
3. Replace the placeholder photography.
4. Once address, phone and hours are verified, add `FoodEstablishment` structured data in
   `src/app/layout.tsx` (a note marks the spot).

## How ordering works

Each "Order This Tiffin" button is a WhatsApp link with the message pre-filled, for example:

```
Hare Krishna 🙏
I would like to order Tiffin 1 (₹65).
Meal:
5 Chapati
1 Bowl Curry / Sabzi
Pickle
Please share the ordering details.
Thank you!
```

The message is built in `src/lib/whatsapp.ts` from the package data. Nothing is ordered until the
customer presses send and Dhara Kitchen replies — the site says so.

## Structure

```
src/app/                       layout, page, global styles (theme tokens), OG image
src/components/hero/           hero + procedural 3D vegetarian thali (lazy-loaded)
src/components/menu/           tiffin package cards (TiltCard)
src/components/food-showcase/  15-day menu (HoverExpand + CursorImageTrail)
src/components/sections/       why choose (AnimatedList), kitchen story, about, FAQ, testimonials
src/components/order/          WhatsApp order links + "how to order" section
src/components/hover-expand/ · cursor-image-trail/ · tilt-card/ · animated-list/   reusable interactions
src/lib/                       client data, config, images, WhatsApp helpers
src/hooks/                     theme + media-query hooks
```
