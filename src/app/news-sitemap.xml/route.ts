import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, gte, and } from 'drizzle-orm';

// Google News Sitemap — refresh every 15 minutes so fresh articles appear fast
export const revalidate = 900;

const SITE_URL = 'https://www.shop.nexuscalculator.net';
const PUBLICATION_NAME = 'The Nexus Journal';
const PUBLICATION_LANGUAGE = 'en';

export async function GET() {
  // Google News Sitemap only includes articles published in the LAST 48 HOURS
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const recentPosts = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        gte(posts.publishedAt, cutoff)
      )
    );

  // Build one <url> entry per article
  const urlEntries = recentPosts.map((post) => {
    const articleUrl = `${SITE_URL}/blog/${post.slug}`;
    // W3C datetime format with timezone (required by Google)
    const pubDate = post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : new Date().toISOString();

    // Escape XML special characters in title
    const safeTitle = post.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLICATION_NAME}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${safeTitle}</news:title>
    </news:news>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Cache 15 minutes at CDN edge — keeps it fresh for crawlers
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
