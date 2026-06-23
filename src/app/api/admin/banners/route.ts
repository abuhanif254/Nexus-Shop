import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(banners).orderBy(desc(banners.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, link, position, order } = body;

    if (!image || !link || !position) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newBanner = await db.insert(banners).values({
      image,
      link,
      position,
      order: parseInt(order) || 0,
      createdAt: new Date()
    }).returning();

    return NextResponse.json({ success: true, data: newBanner[0] });
  } catch (error) {
    console.error("Create Banner Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create banner" }, { status: 500 });
  }
}
