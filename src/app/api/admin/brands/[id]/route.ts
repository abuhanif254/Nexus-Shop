import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.delete(brands).where(eq(brands.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Brand Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete brand" }, { status: 500 });
  }
}
