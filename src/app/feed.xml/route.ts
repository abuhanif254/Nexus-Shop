import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const publishedPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(20);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Replace with production URL later

  const feedItems = publishedPosts.map(post => {
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
        <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}]]></description>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
        ${post.featuredImage ? `<enclosure url="${post.featuredImage.startsWith('http') ? post.featuredImage : siteUrl + post.featuredImage}" type="image/jpeg" />` : ''}
      </item>
    `;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Nexus Shop Blog</title>
        <link>${siteUrl}/blog</link>
        <description>The latest news, tips, and trends from Nexus Shop.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
