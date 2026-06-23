import { db } from "@/db";
import { orders, users, products, orderItems } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch global metrics
  const allOrders = await db.select().from(orders);
  const allUsers = await db.select().from(users);
  
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = allOrders.length;
  const totalUsers = allUsers.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  // Process chart data (last 30 days)
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      date: d.toISOString().split('T')[0],
      revenue: 0,
      orders: 0
    };
  }).reverse();

  allOrders.forEach(order => {
    const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = last30Days.find(d => d.date === dateStr);
    if (dayData) {
      dayData.revenue += order.totalAmount;
      dayData.orders += 1;
    }
  });

  // Recent Orders (last 5)
  const recentOrders = await db.select({
    order: orders,
    user: users,
  })
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .orderBy(desc(orders.createdAt))
  .limit(5);

  // Top Selling Products
  const topProductsRaw = await db.select({
    productId: orderItems.productId,
    productName: orderItems.productName,
    totalQuantity: sql<number>`cast(sum(${orderItems.quantity}) as int)`,
    totalRevenue: sql<number>`cast(sum(${orderItems.quantity} * ${orderItems.priceAtPurchase}) as float)`,
  })
  .from(orderItems)
  .groupBy(orderItems.productId, orderItems.productName)
  .orderBy(desc(sql`sum(${orderItems.quantity})`))
  .limit(5);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          Last 30 Days
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<DollarSign size={20} />} trend="+12.5%" />
        <MetricCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag size={20} />} trend="+5.2%" />
        <MetricCard title="Total Customers" value={totalUsers.toString()} icon={<Users size={20} />} trend="+18.1%" />
        <MetricCard title="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon={<Activity size={20} />} trend="-2.4%" />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Over Time</h2>
        <div className="h-[300px] w-full">
          <RevenueChart data={last30Days} />
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-semibold text-brand-orange hover:underline">View All</a>
          </div>
          <div className="flex-1 space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent orders.</p>
            ) : (
              recentOrders.map(({ order, user }) => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">#{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{user?.name || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs font-semibold text-brand-orange">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="flex-1 space-y-4">
            {topProductsRaw.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-4">No products sold yet.</p>
            ) : (
              topProductsRaw.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-50 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{product.totalQuantity} sold</p>
                    <p className="text-xs text-gray-500">${product.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-orange-50 text-brand-orange rounded-lg">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}
