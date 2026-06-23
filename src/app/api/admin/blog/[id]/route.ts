import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.select().from(posts).where(eq(posts.id, id));
    if (data.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, content, excerpt, featuredImage, isPublished } = body;

    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (existingPost.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    let publishedAt = existingPost[0].publishedAt;
    if (isPublished && !existingPost[0].isPublished) {
      publishedAt = new Date();
    } else if (!isPublished) {
      publishedAt = null;
    }

    const updatedPost = await db.update(posts).set({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featuredImage: featuredImage || null,
      isPublished: !!isPublished,
      publishedAt,
      updatedAt: new Date(),
    }).where(eq(posts.id, id)).returning();

    return NextResponse.json({ success: true, data: updatedPost[0] });
  } catch (error: any) {
    console.error("Update Post Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(posts).where(eq(posts.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
