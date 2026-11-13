import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card, generated at build time in the brand colours. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F8F3E9",
          color: "#263D2B",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 56,
              border: "3px solid #263D2B",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 34, letterSpacing: -0.5 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.02, letterSpacing: -2, maxWidth: 940 }}>
            {siteConfig.tagline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#73513B",
              fontFamily: "Helvetica, Arial, sans-serif",
              maxWidth: 820,
            }}
          >
            {siteConfig.positioning}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 84, height: 4, background: "#D99B43" }} />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#536B45",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            100% PURE VEGETARIAN · HOMEMADE TIFFIN
          </div>
        </div>
      </div>
    ),
    size,
  );
}
