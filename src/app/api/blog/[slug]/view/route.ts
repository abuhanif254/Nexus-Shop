import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * POST /api/blog/[slug]/view
 * Increments the view_count for the given post slug.
 * Called silently from the blog post page on mount.
 * No auth required — rate limiting handled by Vercel/CDN edge.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.slug, slug));

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail — view count is non-critical
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
