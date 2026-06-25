import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.shop.nexuscalculator.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Main rule — allow everything except admin/api
        userAgent: '*',
        allow: [
          '/',
          '/blog/',
          '/blog/$',
          '/feed.xml',
          '/rss',
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
          '/*?*',      // Disallow query strings to prevent duplicate content
        ],
        crawlDelay: 1,
      },
      {
        // Google's news/media bot — allow everything with faster crawl
        userAgent: 'Googlebot-News',
        allow: ['/blog/', '/blog/$', '/feed.xml'],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/feed.xml`,   // Google also indexes RSS sitemaps
    ],
    host: BASE_URL,
  };
}
