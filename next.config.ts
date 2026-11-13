import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile higher up the
  // folder tree would otherwise confuse Turbopack).
  turbopack: { root: process.cwd() },
  images: {
    // Placeholder photography is served from Unsplash until the client
    // supplies their own images (drop those into /public/images and update
    // src/lib/images.ts — no remote pattern is needed for local files).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
