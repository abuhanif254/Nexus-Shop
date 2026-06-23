import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');

    let query: any = db.select().from(banners).orderBy(asc(banners.order));

    if (position) {
      query = db.select().from(banners).where(eq(banners.position, position)).orderBy(asc(banners.order));
    }

    const data = await query;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fetch Banners Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}
