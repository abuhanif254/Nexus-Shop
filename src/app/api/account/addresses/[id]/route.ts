import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    if (data.isDefault) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, session.user.id));
    }

    await db.update(userAddresses)
      .set({
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault,
      })
      .where(and(eq(userAddresses.id, unwrappedParams.id), eq(userAddresses.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.delete(userAddresses)
      .where(and(eq(userAddresses.id, unwrappedParams.id), eq(userAddresses.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
