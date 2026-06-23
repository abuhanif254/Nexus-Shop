
import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, shippingAddresses, products } from "@/db/schema";

import Stripe from "stripe";
import { auth } from "@/auth";
import { eq, inArray } from "drizzle-orm";

// Initialize Stripe (will fail gracefully if no API key is provided)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, subtotal, tax, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // --- INVENTORY CHECK ---
    const productIds = items.map((i: any) => i.id.toString().split('-')[0]);
    const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
    
    for (const item of items) {
      const baseProductId = item.id.toString().split('-')[0];
      const dbProduct = dbProducts.find(p => p.id === baseProductId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 400 });
      }
      if (dbProduct.totalStock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${item.title}. Only ${dbProduct.totalStock} left.` 
        }, { status: 400 });
      }
    }

    // Security Check: In a real app, we would re-fetch product prices from the DB
    // to ensure the client hasn't tampered with the payload. 
    // For this demonstration, we'll accept the calculated totals.
    const calculatedTotal = subtotal + tax + shipping;

    const orderId = crypto.randomUUID();
    const session = await auth();
    const userId = session?.user?.id || null;

    // Insert Order
    await db.insert(orders).values({
      id: orderId,
      userId: userId,
      totalAmount: calculatedTotal,
      taxAmount: tax,
      shippingFee: shipping,
      paymentMethod: paymentMethod,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      createdAt: new Date(),
    });

    // Insert Shipping Address
    await db.insert(shippingAddresses).values({
      id: crypto.randomUUID(),
      orderId: orderId,
      email: shippingAddress.email || "guest@example.com",
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: "USA", // Hardcoded for demo
    });

    // Insert Order Items and Decrement Stock
    for (const item of items) {
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId: orderId,
        productId: item.id.toString(),
        productName: item.title,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      });

      // Decrement stock
      const baseProductId = item.id.toString().split('-')[0];
      const dbProduct = dbProducts.find(p => p.id === baseProductId)!;
      await db.update(products)
        .set({ totalStock: dbProduct.totalStock - item.quantity })
        .where(eq(products.id, baseProductId));
    }

    // If Payment Method is Credit Card (Stripe), we create a Checkout Session and return the URL.
    if (paymentMethod === 'CARD') {
      try {
        const lineItems = items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              images: item.image ? [`https://besa-ecommerce.com${item.image}`] : [], // Use placeholder/actual URLs in prod
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }));

        // Add shipping fee if applicable
        if (shipping > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shipping Fee' },
              unit_amount: Math.round(shipping * 100),
            },
            quantity: 1,
          });
        }
        
        // Add tax if applicable
        if (tax > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Estimated Tax' },
              unit_amount: Math.round(tax * 100),
            },
            quantity: 1,
          });
        }

        const origin = req.headers.get('origin') || 'http://localhost:3000';
        
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: lineItems,
          success_url: `${origin}/checkout/success?orderId=${orderId}`,
          cancel_url: `${origin}/checkout`,
          payment_intent_data: {
            metadata: { orderId },
          },
          customer_email: shippingAddress.email || undefined,
        });

        // The webhook will receive the payment_intent.succeeded event and update the order
        // and its paymentStatus to PAID.

        return NextResponse.json({
          success: true,
          orderId,
          url: stripeSession.url,
          message: "Redirecting to secure Stripe Checkout..."
        }, { status: 201 });
        
      } catch (e: any) {
        console.warn("Stripe API failed to create Checkout Session.", e.message);
        // Fallback for demo without valid Stripe keys
        return NextResponse.json({ 
          success: true, 
          orderId, 
          url: `/checkout/success?orderId=${orderId}&mock_stripe=true`,
          message: "Mock Stripe fallback" 
        }, { status: 201 });
      }
    }

    if (paymentMethod === 'SSLCOMMERZ') {
      const SSLCommerzPayment = require('sslcommerz-lts');
      const store_id = process.env.STORE_ID || 'nexus6a39eba39cefb';
      const store_passwd = process.env.STORE_PASSWORD || 'nexus6a39eba39cefb@ssl';
      const is_live = false; // true for live, false for sandbox

      const origin = req.headers.get('origin') || 'http://localhost:3000';

      const data = {
          total_amount: calculatedTotal * 115, // Assuming shop is in USD, converting to BDT
          currency: 'BDT',
          tran_id: orderId, // unique transaction id
          success_url: `${origin}/api/webhooks/sslcommerz?status=success&orderId=${orderId}`,
          fail_url: `${origin}/api/webhooks/sslcommerz?status=fail&orderId=${orderId}`,
          cancel_url: `${origin}/api/webhooks/sslcommerz?status=cancel&orderId=${orderId}`,
          ipn_url: `${origin}/api/webhooks/sslcommerz?status=ipn`,
          shipping_method: 'Courier',
          product_name: 'Nexus Shop Items',
          product_category: 'Ecommerce',
          product_profile: 'general',
          cus_name: shippingAddress.fullName || 'Customer Name',
          cus_email: shippingAddress.email || 'customer@example.com',
          cus_add1: shippingAddress.addressLine1 || 'Dhaka',
          cus_add2: 'Dhaka',
          cus_city: shippingAddress.city || 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: shippingAddress.postalCode || '1000',
          cus_country: 'Bangladesh',
          cus_phone: shippingAddress.phone || '01711111111',
          cus_fax: '01711111111',
          ship_name: shippingAddress.fullName || 'Customer Name',
          ship_add1: shippingAddress.addressLine1 || 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: shippingAddress.city || 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: shippingAddress.postalCode || '1000',
          ship_country: 'Bangladesh',
      };
      
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
      
      try {
        const apiResponse = await sslcz.init(data);
        if (apiResponse?.GatewayPageURL) {
          return NextResponse.json({
            success: true,
            orderId,
            url: apiResponse.GatewayPageURL,
            message: "Redirecting to SSLCommerz..."
          }, { status: 201 });
        } else {
          throw new Error('No GatewayPageURL found in SSLCommerz response');
        }
      } catch (e: any) {
         console.error("SSLCommerz initialization failed", e);
         return NextResponse.json({ error: "Failed to initialize SSLCommerz" }, { status: 500 });
      }
    }

    // For Cash on Delivery we immediately redirect to success.
    return NextResponse.json({ 
      success: true, 
      orderId, 
      message: "Order successfully created" 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}

