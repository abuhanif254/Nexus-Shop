import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Search, Filter, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import OrderActions from "@/components/admin/OrderActions";

export default async function AdminOrdersPage() {
  // Fetch all orders globally, along with basic user details if linked
  const allOrders = await db.select({
    order: orders,
    userEmail: users.email,
    userName: users.name,
  })
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .orderBy(desc(orders.createdAt));

  // Calculate metrics
  const totalRevenue = allOrders.reduce((sum, { order }) => sum + order.totalAmount, 0);
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(({ order }) => order.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-black text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-black text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Pending Fulfillment</h3>
          <p className="text-3xl font-black text-brand-orange">{pendingOrders}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></span>
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-orange outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {allOrders.map(({ order, userName, userEmail }) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-brand-dark">#{order.id.split('-')[0].toUpperCase()}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt))}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-gray-900">{userName || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{userEmail || 'N/A'}</p>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'DELIVERED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700' :
                      'bg-brand-orange/10 text-brand-orange'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <OrderActions orderId={order.id} currentStatus={order.status} paymentStatus={order.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to {allOrders.length} of {allOrders.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-brand-orange bg-brand-orange text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
