export const runtime = 'edge';
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userAddresses } from "@/db/schema";

import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await db.select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, session.user.id));

    return NextResponse.json({ addresses, userEmail: session.user.email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // If setting as default, unset others
    if (data.isDefault) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, session.user.id));
    }

    await db.insert(userAddresses).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country || "USA",
      isDefault: data.isDefault || false,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

