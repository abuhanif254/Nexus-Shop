import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
    if (!data.length) {
      return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch banner" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { image, link, position, order, title, subtitle, buttonText, active } = body;

    if (!image || !link || !position) {
      return NextResponse.json({ success: false, error: "Image URL, affiliate link, and position are required" }, { status: 400 });
    }

    const updated = await db.update(banners).set({
      image,
      link,
      position,
      order: parseInt(order) || 0,
      title: title || null,
      subtitle: subtitle || null,
      buttonText: buttonText || null,
      active: active !== undefined ? Boolean(active) : true,
    }).where(eq(banners.id, id)).returning();

    if (!updated.length) {
      return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Update Banner Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(banners).where(eq(banners.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Banner Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete banner" }, { status: 500 });
  }
}
