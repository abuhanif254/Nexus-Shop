import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function wordCount(content: string): number {
  return stripHtml(content).split(/\s+/).filter(Boolean).length;
}

export async function GET() {
  const siteUrl = 'https://www.shop.nexuscalculator.net';

  const publishedPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(50);

  const feedItems = publishedPosts.map(post => {
    const postUrl = `${siteUrl}/blog/${escapeXml(post.slug)}`;
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
    const updDate  = post.updatedAt  ? new Date(post.updatedAt).toUTCString()  : pubDate;
    const excerpt  = post.excerpt
      ? escapeXml(post.excerpt)
      : escapeXml(stripHtml(post.content).substring(0, 250) + '…');
    const imageUrl = post.featuredImage
      ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${siteUrl}${post.featuredImage}`)
      : '';
    const tagList  = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const wc       = wordCount(post.content);

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <atom:updated>${updDate}</atom:updated>

      ${post.author   ? `<dc:creator><![CDATA[${post.author}]]></dc:creator>` : ''}
      ${post.category ? `<category><![CDATA[${post.category}]]></category>`   : ''}
      ${tagList.map(t => `<category domain="tag"><![CDATA[${t}]]></category>`).join('\n      ')}

      <description><![CDATA[${excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>

      ${imageUrl ? `
      <media:content
        url="${escapeXml(imageUrl)}"
        medium="image"
        isDefault="true"
      >
        <media:title type="plain"><![CDATA[${post.title}]]></media:title>
        <media:description type="plain"><![CDATA[${excerpt}]]></media:description>
      </media:content>
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />` : ''}

      <slash:comments>0</slash:comments>
      <wfw:commentRss>${postUrl}#comments</wfw:commentRss>
      <thr:total>0</thr:total>
    </item>`.trim();
  }).join('\n\n  ');

  const buildDate = new Date().toUTCString();
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss
  version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:thr="http://purl.org/syndication/thread/1.0"
>
  <channel>
    <title>The Nexus Journal — Nexus Shop Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Expert insights on affiliate marketing, technology, and lifestyle from The Nexus Journal — your guide to smarter decisions.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>blog@shop.nexuscalculator.net (Nexus Shop)</managingEditor>
    <webMaster>blog@shop.nexuscalculator.net (Nexus Shop)</webMaster>
    <generator>Next.js + Nexus Shop</generator>
    <ttl>60</ttl>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>Nexus Shop</title>
      <link>${siteUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <atom:link href="${siteUrl}/rss" rel="alternate" type="application/rss+xml" />

  ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
