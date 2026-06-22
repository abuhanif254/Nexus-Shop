import { auth } from "@/auth";
import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import AddressListClient from "@/components/account/AddressListClient";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const addresses = await db.select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, session.user.id))
    .orderBy(desc(userAddresses.isDefault));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <AddressListClient initialAddresses={addresses} />
    </div>
  );
}
