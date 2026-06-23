import { NextResponse } from 'next/server';
import { db } from '@/db';
import { coupons } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPercentage, validUntil, usageLimit } = body;

    if (!code || !discountPercentage || !validUntil) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = await db.insert(coupons).values({
      code: code.toUpperCase(),
      discountPercentage: Number(discountPercentage),
      validUntil: new Date(validUntil),
      usageLimit: Number(usageLimit) || 0
    }).returning();

    return NextResponse.json({ success: true, data: newCoupon[0] });
  } catch (error: any) {
    console.error("Create Coupon Error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}
