import { NextResponse } from 'next/server';
import { db } from '@/db';
import { storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(storeSettings).limit(1);
    if (data.length === 0) {
      // Return default
      return NextResponse.json({ success: true, data: { storeName: 'My Store', contactEmail: 'support@store.com', currency: 'USD', taxRate: 0, flatShippingFee: 0 } });
    }
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeName, contactEmail, currency, taxRate, flatShippingFee } = body;

    const existing = await db.select().from(storeSettings).limit(1);

    if (existing.length === 0) {
      const newSettings = await db.insert(storeSettings).values({
        storeName, contactEmail, currency, taxRate: Number(taxRate), flatShippingFee: Number(flatShippingFee)
      }).returning();
      return NextResponse.json({ success: true, data: newSettings[0] });
    } else {
      const id = existing[0].id;
      const updated = await db.update(storeSettings).set({
        storeName, contactEmail, currency, taxRate: Number(taxRate), flatShippingFee: Number(flatShippingFee), updatedAt: new Date()
      }).where(eq(storeSettings.id, id)).returning();
      return NextResponse.json({ success: true, data: updated[0] });
    }
  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
