import { ReactNode } from "react";
import Link from "next/link";
import { User, MapPin, Package, LogOut, Heart, LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen py-8 md:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white dark:bg-[#151515] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm shadow-gray-200/50 dark:shadow-none sticky top-24">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-[#111111]/50">
                <div className="w-14 h-14 bg-brand-orange text-white rounded-full flex items-center justify-center font-black text-2xl shadow-[0_5px_15px_rgba(249,78,48,0.3)]">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-[140px] text-lg">{session.user.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{session.user.email}</p>
                </div>
              </div>
              
              <nav className="p-4 space-y-1.5">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all group">
                  <LayoutDashboard size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" /> Dashboard
                </Link>
                <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all group">
                  <User size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" /> My Profile
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all group">
                  <MapPin size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" /> Saved Addresses
                </Link>
                <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all group">
                  <Package size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all group">
                  <Heart size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-orange transition-colors" /> Wishlist
                </Link>
                
                <hr className="my-3 border-gray-100 dark:border-gray-800" />
                
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all group">
                    <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" /> Log Out
                  </button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
