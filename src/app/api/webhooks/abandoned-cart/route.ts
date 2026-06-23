import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, cartItems, subtotal } = body;

    if (!email || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // MOCK: In a real app, this would use Resend to send a beautifully styled React Email.
    console.log(`[EMAIL MOCK - ABANDONED CART] Sending email to ${email}`);
    console.log(`[EMAIL MOCK - ABANDONED CART] Subtotal: $${subtotal}`);
    console.log(`[EMAIL MOCK - ABANDONED CART] Items:`, cartItems.map((i: any) => i.title).join(", "));
    
    // Simulate API delay for Resend
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      success: true, 
      message: "Abandoned cart email triggered successfully",
      mockEmailId: `em_${Math.random().toString(36).substring(7)}`
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Failed to trigger abandoned cart email" }, { status: 500 });
  }
}
