import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, PackageOpen } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session || !session.user || session.user.email !== "mohammadbitullah3@gmail.com") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Admin User</span>
            <div className="w-8 h-8 bg-brand-dark text-white flex items-center justify-center rounded-full font-bold text-sm">A</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
