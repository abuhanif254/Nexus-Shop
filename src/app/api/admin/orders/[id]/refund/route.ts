export const runtime = "edge";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidateCachePath } from "@/actions/revalidate";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id)
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: "Order is not paid" }, { status: 400 });
    }

    // Process refund with Stripe if a paymentIntentId exists
    if (order.paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: order.paymentIntentId,
        });
      } catch (stripeError: any) {
        console.error("Stripe Refund Error:", stripeError);
        // Fallback for mock environments
        if (!stripeError.message.includes('sk_test_mock') && process.env.STRIPE_SECRET_KEY) {
           return NextResponse.json({ error: "Refund failed with Stripe" }, { status: 500 });
        }
      }
    }

    // Update order status in DB
    await db.update(orders)
      .set({ 
        paymentStatus: 'REFUNDED',
        status: 'CANCELLED' 
      })
      .where(eq(orders.id, id));

    await revalidateCachePath('/', 'layout');

    return NextResponse.json({ success: true, message: "Order refunded successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("REFUND ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
