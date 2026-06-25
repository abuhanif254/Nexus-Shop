import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimisation ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
    // Serve optimised images at these sizes (matches Tailwind breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimised images for 60 days on CDN
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },

  // ── HTTP Security Headers ───────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options",    value: "nosniff"          },
          // Block framing (clickjacking protection)
          { key: "X-Frame-Options",           value: "SAMEORIGIN"       },
          // Force HTTPS for 1 year, include sub-domains
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Referrer — send origin only for cross-origin
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          // Minimal permissions policy (no camera / mic / payment by default)
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          // XSS protection header (legacy IE11 fallback)
          { key: "X-XSS-Protection",         value: "1; mode=block"    },
        ],
      },
      // ── Feed / Sitemap caching headers ──
      {
        source: "/feed.xml",
        headers: [
          { key: "Cache-Control", value: "s-maxage=3600, stale-while-revalidate=86400" },
          { key: "Content-Type",  value: "application/xml; charset=utf-8" },
        ],
      },
      {
        source: "/rss",
        headers: [
          { key: "Cache-Control", value: "s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  // ── Redirects ───────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy URL guard: redirect /blog/feed → /feed.xml
      { source: "/blog/feed", destination: "/feed.xml", permanent: true },
      // Alternate RSS paths
      { source: "/feed",      destination: "/feed.xml", permanent: true },
    ];
  },

  // ── Compiler options ─────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production (keeps console.error/warn)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Logging ──────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // ── Experimental ─────────────────────────────────────────────────────────
  experimental: {
    // Optimise CSS delivery (eliminates render-blocking CSS)
    optimizeCss: false, // disabled — requires critters package
  },

  // ── Power pack (output) ───────────────────────────────────────────────────
  // Leave as default 'standalone' on Vercel — Vercel handles this automatically
};

export default nextConfig;
