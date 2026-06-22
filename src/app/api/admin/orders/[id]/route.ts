import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Unwrapping the async params (Next.js 15+ requirement for dynamic route segments)
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update order
    await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id));

    return NextResponse.json({ success: true, message: "Order status updated" }, { status: 200 });

  } catch (error: any) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
