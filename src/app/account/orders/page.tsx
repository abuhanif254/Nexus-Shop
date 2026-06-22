import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderTracker from "@/components/ui/OrderTracker";

export default async function OrderHistoryPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userOrders = await db.select()
    .from(orders)
    .where(eq(orders.userId, session.user.id!))
    .orderBy(desc(orders.createdAt))
    .limit(20);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PENDING': return { color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800', icon: Clock, label: 'Pending Payment' };
      case 'PROCESSING': return { color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800', icon: Package, label: 'Processing' };
      case 'SHIPPED': return { color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800', icon: Truck, label: 'Shipped' };
      case 'DELIVERED': return { color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800', icon: CheckCircle2, label: 'Delivered' };
      default: return { color: 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700', icon: Package, label: status };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Order History</h1>
      </div>
      
      {userOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#151515] rounded-3xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-100 dark:border-gray-800">
            <Package size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">When you place an order, it will appear here. Start exploring our collections to find your next favorite item.</p>
          <Link href="/shop" className="inline-flex bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-[0_10px_30px_rgba(249,78,48,0.2)]">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;
            
            return (
              <div key={order.id} className="bg-white dark:bg-[#151515] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group">
                
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-12 gap-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                      <p className="font-bold text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-bold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                      <p className="font-mono text-gray-900 dark:text-white">{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold w-fit ${status.color}`}>
                    <StatusIcon size={16} />
                    {status.label}
                  </div>
                </div>
                
                {/* Order Body */}
                <div className="p-6 md:p-8 flex flex-col gap-8">
                  {/* Reuse the existing OrderTracker component */}
                  <OrderTracker currentStatus={order.status} />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      <span className="bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        Method: <span className="text-brand-orange">{order.paymentMethod}</span>
                      </span>
                      <span className="bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        Payment: <span className={order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'}>{order.paymentStatus}</span>
                      </span>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center shadow-sm">
                        View Invoice
                      </button>
                      <button className="flex-1 sm:flex-none bg-brand-orange text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors text-center shadow-[0_10px_20px_rgba(249,78,48,0.2)]">
                        Track Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
