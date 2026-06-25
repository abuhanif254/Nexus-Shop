import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');

    // Only serve active banners to the public
    const conditions = position
      ? and(eq(banners.position, position), eq(banners.active, true))
      : eq(banners.active, true);

    const data = await db.select().from(banners).where(conditions).orderBy(asc(banners.order));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fetch Banners Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}
