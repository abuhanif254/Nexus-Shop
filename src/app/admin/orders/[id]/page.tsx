import { db } from "@/db";
import { orders, orderItems, shippingAddresses, users, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Printer, Calendar, CreditCard, Truck, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import OrderActions from "@/components/admin/OrderActions";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the order
  const orderRes = await db.select().from(orders).where(eq(orders.id, id));
  if (!orderRes.length) return notFound();
  const order = orderRes[0];

  // Fetch items
  const itemsRaw = await db.select({
    item: orderItems,
    productImage: products.image,
  })
  .from(orderItems)
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, id));

  // Fetch address
  const addressRes = await db.select().from(shippingAddresses).where(eq(shippingAddresses.orderId, id));
  const address = addressRes[0];

  // Fetch user if linked
  let user = null;
  if (order.userId) {
    const userRes = await db.select().from(users).where(eq(users.id, order.userId));
    user = userRes[0] || null;
  }

  const shortId = order.id.split('-')[0].toUpperCase();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/orders" className="text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Order #{shortId}</h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
              order.status === 'DELIVERED' ? 'bg-blue-100 text-blue-700' :
              order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700' :
              'bg-brand-orange/10 text-brand-orange'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            {new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(order.createdAt))}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => window.print()}>
            <Printer size={16} /> Print Invoice
          </button>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <OrderActions orderId={order.id} currentStatus={order.status} paymentStatus={order.paymentStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Totals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Qty</th>
                    <th className="p-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itemsRaw.map(({ item, productImage }) => (
                    <tr key={item.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden border border-gray-200 shrink-0">
                            {productImage ? (
                              <Image src={productImage} alt={item.productName} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500">ID: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">${item.priceAtPurchase.toFixed(2)}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">x{item.quantity}</td>
                      <td className="p-4 text-sm font-bold text-gray-900 text-right">${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col gap-2 items-end text-sm">
              <div className="flex justify-between w-full max-w-xs text-gray-600">
                <span>Subtotal</span>
                <span>${(order.totalAmount - order.taxAmount - order.shippingFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs text-gray-600">
                <span>Shipping Fee</span>
                <span>${order.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs text-gray-600">
                <span>Tax</span>
                <span>${order.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs text-lg font-black text-gray-900 mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer and Shipping */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              <h2 className="font-semibold text-gray-900">Customer Summary</h2>
            </div>
            <div className="p-4 space-y-4 text-sm">
              {user ? (
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Guest Customer</p>
              )}
              {address && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Details</p>
                  <p className="text-gray-900">{address.fullName}</p>
                  <p className="text-gray-600">{address.email}</p>
                  <p className="text-gray-600">{address.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                <Truck size={18} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="p-4 text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400" />
              <h2 className="font-semibold text-gray-900">Payment details</h2>
            </div>
            <div className="p-4 text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <span className="text-xs text-gray-400 block mb-1">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-900 break-all">{order.paymentIntentId}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
