import { NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

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
    const {
      title, slug, content, excerpt, featuredImage, isPublished,
      author, category, tags, seoTitle, seoDescription,
    } = body;

    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (existingPost.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Preserve original publishedAt unless toggling published state
    let publishedAt = existingPost[0].publishedAt;
    if (isPublished && !existingPost[0].isPublished) {
      publishedAt = new Date(); // First time publishing
    } else if (!isPublished) {
      publishedAt = null;       // Unpublishing
    }

    const updatedPost = await db.update(posts).set({
      title,
      slug,
      content,
      excerpt:        excerpt        || null,
      featuredImage:  featuredImage  || null,
      isPublished:    !!isPublished,
      publishedAt,
      author:         author         || null,
      category:       category       || null,
      tags:           tags           || null,
      seoTitle:       seoTitle       || null,
      seoDescription: seoDescription || null,
      updatedAt: new Date(),
    }).where(eq(posts.id, id)).returning();

    return NextResponse.json({ success: true, data: updatedPost[0] });
  } catch (error: any) {
    console.error("Update Post Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Slug already exists — please choose a unique slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}

/**
 * PATCH — lightweight quick-toggle for publish/unpublish without sending full body.
 * Body: { isPublished: boolean }
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (existingPost.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const updates: Partial<{ isPublished: boolean; publishedAt: Date | null; updatedAt: Date }> = {
      updatedAt: new Date(),
    };

    if (typeof body.isPublished === 'boolean') {
      updates.isPublished = body.isPublished;
      if (body.isPublished && !existingPost[0].isPublished) {
        updates.publishedAt = new Date();
      } else if (!body.isPublished) {
        updates.publishedAt = null;
      }
    }

    const updated = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();
    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to toggle post" }, { status: 500 });
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
