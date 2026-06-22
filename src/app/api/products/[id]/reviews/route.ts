import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, users, products, orders, orderItems } from "@/db/schema";
import { auth } from "@/auth";

import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const productId = unwrappedParams.id;
    
    // Fetch reviews with user info
    const allReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
      }
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId));

    return NextResponse.json({ reviews: allReviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const unwrappedParams = await params;
    const productId = unwrappedParams.id;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    // Verify if user actually purchased this product
    const purchased = await db.select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.userId, session.user.id),
          eq(orderItems.productId, productId)
        )
      );

    if (purchased.length === 0) {
      return NextResponse.json({ error: "You can only review products you have purchased" }, { status: 403 });
    }

    // Insert review
    await db.insert(reviews).values({
      id: crypto.randomUUID(),
      productId,
      userId: session.user.id,
      rating,
      comment,
      createdAt: new Date(),
    });

    // Update product average rating
    const allProductReviews = await db.select().from(reviews).where(eq(reviews.productId, productId));
    const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allProductReviews.length;

    await db.update(products)
      .set({ rating: avgRating, reviews: allProductReviews.length })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
