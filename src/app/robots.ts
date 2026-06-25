import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.shop.nexuscalculator.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // ── Main crawler rule ──────────────────────────────────────────────
        // Allow all public content; block private/functional paths.
        // NOTE: We do NOT use /*?* here — that was blocking valid blog
        //       category filter URLs (/blog?category=Technology).
        //       Instead we target specific functional query patterns.
        userAgent: '*',
        allow: [
          '/',
          '/blog/',
          '/blog$',
          '/shop',
          '/category/',
          '/product/',
          '/about',
          '/contact',
          '/faq',
          '/feed.xml',
          '/news-sitemap.xml',
          '/sitemap.xml',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/cart',
          '/checkout',
          '/login',
          '/register',
          '/wishlist',
          // Block search result pages and session/tracking params only
          '/*?s=',
          '/*?search=',
          '/*?session=',
          '/*?ref=',
          '/*?utm_',
        ],
        crawlDelay: 1,
      },
      {
        // ── Googlebot-News: allow only blog content, fast crawl ───────────
        // No crawlDelay for Googlebot-News so fresh articles index quickly.
        userAgent: 'Googlebot-News',
        allow: [
          '/blog/',
          '/blog$',
          '/feed.xml',
          '/news-sitemap.xml',
        ],
        disallow: ['/'],
      },
      {
        // ── Block AI training crawlers (they don't send traffic) ──────────
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        // ── Allow AI search/retrieval bots (they DO send traffic) ─────────
        userAgent: 'OAI-SearchBot',
        allow: ['/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/'],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`, // Google News sitemap — articles last 48h
      `${BASE_URL}/feed.xml`,
    ],
    host: BASE_URL,
  };
}
