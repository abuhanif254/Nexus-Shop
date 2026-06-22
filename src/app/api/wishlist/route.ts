import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishlists, products } from "@/db/schema";
import { auth } from "@/auth";

import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ items: [] });

    const wishlistItems = await db.select({
      id: products.id,
      title: products.title,
      price: products.price,
      image: products.image,
      brand: products.brand,
    })
    .from(wishlists)
    .innerJoin(products, eq(wishlists.productId, products.id))
    .where(eq(wishlists.userId, session.user.id));

    // Map image paths for frontend compatibility (some components prepend a slash, etc.)
    const mappedItems = wishlistItems.map(item => ({
      ...item,
      image: item.image.startsWith('/') ? item.image : `/${item.image}.jpg`
    }));

    return NextResponse.json({ items: mappedItems });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();

    // Check if it already exists
    const existing = await db.select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, session.user.id), eq(wishlists.productId, productId)));

    if (existing.length === 0) {
      await db.insert(wishlists).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        productId,
        createdAt: new Date(),
      });
    } else {
      // If it exists, toggle off (remove)
      await db.delete(wishlists)
        .where(and(eq(wishlists.userId, session.user.id), eq(wishlists.productId, productId)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
