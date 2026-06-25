import { NextResponse } from 'next/server';
import { db } from '@/db';
import { storeSettings } from '@/db/schema';

export const dynamic = 'force-dynamic';

/**
 * Public endpoint — returns only non-sensitive store settings needed by the frontend.
 * This is used by CartDrawer, cart page, and checkout page to check if orders are enabled.
 */
export async function GET() {
  try {
    const data = await db.select({
      ordersEnabled: storeSettings.ordersEnabled,
      storeName: storeSettings.storeName,
      currency: storeSettings.currency,
    }).from(storeSettings).limit(1);

    if (data.length === 0) {
      // Default: orders are ON if no settings row exists yet
      return NextResponse.json({ ordersEnabled: true, storeName: 'Nexus Shop', currency: 'USD' });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Store settings fetch error:", error);
    // Fail safe: if DB is unreachable, treat orders as enabled to not block users
    return NextResponse.json({ ordersEnabled: true, storeName: 'Nexus Shop', currency: 'USD' });
  }
}
