import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/account/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) return redirect("/login");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>
      
      <ProfileForm user={user} />
    </div>
  );
}
