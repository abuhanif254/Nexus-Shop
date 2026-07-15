export const runtime = "edge";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidateCachePath } from "@/actions/revalidate";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Unwrapping the async params (Next.js 15+ requirement for dynamic route segments)
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    const updateData: any = {};

    if (status) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      updateData.paymentStatus = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Update order
    await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id));

    await revalidateCachePath('/', 'layout');

    return NextResponse.json({ success: true, message: "Order updated" }, { status: 200 });

  } catch (error: any) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
