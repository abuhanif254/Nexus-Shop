"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, TicketPercent, Check, X } from "lucide-react";

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [newUsageLimit, setNewUsageLimit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: newCode, 
          discountPercentage: newDiscount, 
          validUntil: newValidUntil,
          usageLimit: newUsageLimit || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewCode("");
        setNewDiscount("");
        setNewValidUntil("");
        setNewUsageLimit("");
        fetchCoupons();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add coupon");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TicketPercent className="text-brand-orange" /> Discount & Promotion Engine
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Generate New Promo Code</h2>
        <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input required type="text" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange uppercase" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
            <input required type="number" min="1" max="100" value={newDiscount} onChange={e => setNewDiscount(e.target.value)} placeholder="20" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input required type="date" value={newValidUntil} onChange={e => setNewValidUntil(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (0=unlim)</label>
            <input type="number" min="0" value={newUsageLimit} onChange={e => setNewUsageLimit(e.target.value)} placeholder="0" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <button disabled={isAdding} type="submit" className="w-full bg-brand-orange text-white p-2 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 flex items-center justify-center gap-2">
              <Plus size={18} /> {isAdding ? 'Adding...' : 'Add Coupon'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4 font-medium">Promo Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Uses</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No coupons found.</td></tr>
              ) : (
                coupons.map(coupon => {
                  const isExpired = new Date(coupon.validUntil) < new Date();
                  const isLimitReached = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
                  const isActive = !isExpired && !isLimitReached;

                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-green-600">{coupon.discountPercentage}% OFF</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {isActive ? <><Check size={12}/> Active</> : <><X size={12}/> Inactive</>}
                        </span>
                        {isExpired && <span className="block text-xs text-red-500 mt-1">Expired</span>}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {coupon.usedCount} / {coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
