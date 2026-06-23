
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';



async function requireAuth() {
  const session = await auth();
  if (!session?.user || session.user.email !== "mohammadbitullah3@gmail.com") {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.oldPrice !== undefined) updateData.oldPrice = body.oldPrice ? parseFloat(body.oldPrice) : null;
    if (body.discount !== undefined) updateData.discount = body.discount ? parseInt(body.discount) : 0;
    if (body.totalStock !== undefined) updateData.totalStock = body.totalStock ? parseInt(body.totalStock) : 0;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.vendor !== undefined) updateData.vendor = body.vendor;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.featured !== undefined) updateData.featured = body.featured === true;
    updateData.updatedAt = new Date();

    await db.update(products).set(updateData).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
