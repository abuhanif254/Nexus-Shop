import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { Users, Search, Mail, Calendar } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  // Aggregate user data with their orders
  const customers = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    image: users.image,
    joined: users.emailVerified, // NextAuth usually stores this or we use a fallback if not present
    totalOrders: sql<number>`count(${orders.id})`.mapWith(Number),
    totalSpent: sql<number>`COALESCE(sum(${orders.totalAmount}), 0)`.mapWith(Number),
  })
  .from(users)
  .leftJoin(orders, eq(users.id, orders.userId))
  .groupBy(users.id, users.name, users.email, users.image, users.emailVerified)
  .orderBy(desc(sql`count(${orders.id})`));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-brand-orange" /> Customers
        </h1>
        <div className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-sm font-semibold border border-orange-100">
          {customers.length} Total Registered
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-orange outline-none bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Total Orders</th>
                <th className="p-4 font-semibold">Total Spent</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                          {customer.image ? (
                            <Image src={customer.image} alt={customer.name || 'User'} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-orange-50 text-brand-orange">
                              {(customer.name?.[0] || customer.email?.[0] || '?').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{customer.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400 font-mono">ID: {customer.id.substring(0,8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-900">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-sm text-brand-orange font-semibold hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
