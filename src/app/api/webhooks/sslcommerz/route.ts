import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const orderId = url.searchParams.get("orderId");

    // Depending on deployment, req.formData() might be used instead of json
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else if (contentType.includes("application/json")) {
      body = await req.json();
    }

    const tran_id = body.tran_id || orderId;

    if (!tran_id) {
      return NextResponse.json({ error: "No transaction ID" }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status === "success") {
      // In a production app, you MUST validate the payment with SSLCommerz Order Validation API
      // sslcz.validate(body).then(data => ...)
      
      await db.update(orders)
        .set({ paymentStatus: 'PAID', status: 'PROCESSING' })
        .where(eq(orders.id, tran_id));

      // Redirect user to success page
      return NextResponse.redirect(`${origin}/checkout/success?orderId=${tran_id}`, 303);
    } 
    
    if (status === "fail" || status === "cancel") {
      await db.update(orders)
        .set({ paymentStatus: 'FAILED', status: 'CANCELLED' })
        .where(eq(orders.id, tran_id));

      return NextResponse.redirect(`${origin}/checkout/fail?orderId=${tran_id}`, 303);
    }

    if (status === "ipn") {
      // Background IPN call
      if (body.status === 'VALID') {
        await db.update(orders)
          .set({ paymentStatus: 'PAID', status: 'PROCESSING' })
          .where(eq(orders.id, tran_id));
      } else if (body.status === 'FAILED' || body.status === 'CANCELLED') {
        await db.update(orders)
          .set({ paymentStatus: 'FAILED', status: 'CANCELLED' })
          .where(eq(orders.id, tran_id));
      }
      return NextResponse.json({ message: "IPN received" });
    }

    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  } catch (error) {
    console.error("SSLCommerz Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
