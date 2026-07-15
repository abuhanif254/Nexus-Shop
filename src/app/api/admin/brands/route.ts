import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { revalidateCachePath } from '@/actions/revalidate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(brands).orderBy(desc(brands.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, logo } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newBrand = await db.insert(brands).values({
      name,
      slug,
      logo: logo || null
    }).returning();

    await revalidateCachePath('/', 'layout');

    return NextResponse.json({ success: true, data: newBrand[0] });
  } catch (error: any) {
    console.error("Create Brand Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create brand" }, { status: 500 });
  }
}
