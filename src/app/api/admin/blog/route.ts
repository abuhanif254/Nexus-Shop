import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title, slug, content, excerpt, featuredImage, isPublished,
      author, category, tags, seoTitle, seoDescription,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields: title, slug, content" }, { status: 400 });
    }

    const newPost = await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt:        excerpt        || null,
      featuredImage:  featuredImage  || null,
      isPublished:    !!isPublished,
      publishedAt:    isPublished ? new Date() : null,
      author:         author         || null,
      category:       category       || null,
      tags:           tags           || null,
      seoTitle:       seoTitle       || null,
      seoDescription: seoDescription || null,
      viewCount: 0,
    }).returning();

    return NextResponse.json({ success: true, data: newPost[0] });
  } catch (error: any) {
    console.error("Create Post Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Slug already exists — please choose a unique slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 });
  }
}
