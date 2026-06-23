import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, shippingAddresses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: "Order ID and Email are required." }, { status: 400 });
    }

    // Find the order
    const orderResults = await db.select().from(orders).where(eq(orders.id, orderId));
    
    if (orderResults.length === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = orderResults[0];

    // Find the associated shipping address to verify the email
    const addressResults = await db.select().from(shippingAddresses).where(
      and(
        eq(shippingAddresses.orderId, orderId),
        eq(shippingAddresses.email, email)
      )
    );

    if (addressResults.length === 0) {
      return NextResponse.json({ error: "Invalid email for this order." }, { status: 403 });
    }

    const address = addressResults[0];

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        shippingFee: order.shippingFee,
        paymentStatus: order.paymentStatus,
        expectedDelivery: new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) // Mock expected delivery (+3 days)
      },
      shipping: {
        fullName: address.fullName,
        city: address.city,
        country: address.country
      }
    });

  } catch (error: any) {
    console.error("Track Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
