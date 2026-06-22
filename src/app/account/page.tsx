import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Package, Clock, CheckCircle2, TrendingUp, CreditCard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch quick stats
  const userOrders = await db.select().from(orders).where(eq(orders.userId, session.user.id!));
  
  const totalOrders = userOrders.length;
  const pendingOrders = userOrders.filter(o => o.status === 'PENDING').length;
  const completedOrders = userOrders.filter(o => o.status === 'DELIVERED').length;
  const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-brand-dark dark:bg-[#151515] rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-transparent dark:border-gray-800">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back, {session.user.name?.split(' ')[0]}!</h2>
          <p className="text-gray-400">Manage your orders, track shipments, and update your profile from your personal dashboard.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-brand-orange/20 blur-3xl rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Total Orders */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow group flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{totalOrders}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total Orders</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow group flex flex-col gap-4">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{pendingOrders}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Pending</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow group flex flex-col gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{completedOrders}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Completed</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow group flex flex-col gap-4">
          <div className="w-12 h-12 bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/account/orders" className="bg-white dark:bg-[#151515] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-orange dark:hover:border-brand-orange transition-colors group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            Recent Orders <TrendingUp size={18} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track, return, or buy things again.</p>
        </Link>
        <Link href="/account/addresses" className="bg-white dark:bg-[#151515] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-orange dark:hover:border-brand-orange transition-colors group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            Shipping Addresses <TrendingUp size={18} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Edit your addresses for faster checkout.</p>
        </Link>
      </div>

    </div>
  );
}
