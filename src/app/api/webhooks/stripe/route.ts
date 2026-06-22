export const runtime = 'edge';
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders, shippingAddresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderReceiptEmail } from "@/lib/emails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-05-27.dahlia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }
  } else {
    // If no secret, we parse it directly (NOT SECURE FOR PRODUCTION)
    console.warn("No webhook secret found. Bypassing signature validation for demo.");
    event = JSON.parse(payload);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        // Securely update the database status to PAID
        await db.update(orders)
          .set({ 
            paymentStatus: 'PAID',
            status: 'PROCESSING'
          })
          .where(eq(orders.id, orderId));
          
        console.log(`Order ${orderId} successfully marked as PAID.`);
        
        // Fetch shipping address to get email
        const address = await db.query.shippingAddresses.findFirst({
          where: eq(shippingAddresses.orderId, orderId)
        });

        if (address && address.email) {
          // Send Email Receipt here using Resend
          await sendOrderReceiptEmail(address.email, orderId, paymentIntent.amount / 100);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

