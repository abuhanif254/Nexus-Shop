import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(desc(categories.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCategory = await db.insert(categories).values({
      name,
      slug,
      image: image || null
    }).returning();

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, data: newCategory[0] });
  } catch (error: any) {
    console.error("Create Category Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
