import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateCachePath } from '@/actions/revalidate';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(categories).where(eq(categories.id, id));
    await revalidateCachePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
