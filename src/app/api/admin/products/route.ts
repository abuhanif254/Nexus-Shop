
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';

import { auth } from '@/auth';



// Require Admin (for now, we just require authentication)
async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function GET() {
  try {
    await requireAuth();
    const allProducts = await db.select().from(products);
    return NextResponse.json({ success: true, data: allProducts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    
    const newProduct = {
      id: crypto.randomUUID(),
      title: body.title,
      brand: body.brand || 'Generic',
      category: body.category || 'Uncategorized',
      price: parseFloat(body.price),
      oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
      discount: body.discount ? parseInt(body.discount) : 0,
      totalStock: body.totalStock ? parseInt(body.totalStock) : 0,
      image: body.image || 'placeholder',
      vendor: body.vendor || null,
      featured: body.featured === true,
      createdAt: new Date(),
    };

    await db.insert(products).values(newProduct);

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

