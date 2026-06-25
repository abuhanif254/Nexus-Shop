"use client";

import { useState, useEffect } from "react";
import { Settings, Save, ShoppingBag, AlertTriangle, CheckCircle2, Power } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    contactEmail: "",
    currency: "USD",
    taxRate: 0,
    flatShippingFee: 0,
    ordersEnabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setFormData({
          storeName: data.data.storeName || "",
          contactEmail: data.data.contactEmail || "",
          currency: data.data.currency || "USD",
          taxRate: data.data.taxRate ?? 0,
          flatShippingFee: data.data.flatShippingFee ?? 0,
          ordersEnabled: data.data.ordersEnabled !== undefined ? data.data.ordersEnabled : true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading settings...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-brand-orange" /> Store Settings
        </h1>
      </div>

      {/* ─── STORE MODE BANNER (most important for affiliate use) ─── */}
      <div className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
        formData.ordersEnabled
          ? 'border-green-200 bg-green-50'
          : 'border-amber-200 bg-amber-50'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${
              formData.ordersEnabled ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {formData.ordersEnabled
                ? <ShoppingBag size={24} />
                : <AlertTriangle size={24} />
              }
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Store Mode: {formData.ordersEnabled ? '🟢 Orders Active' : '🟡 Affiliate Mode (Orders Paused)'}
              </h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {formData.ordersEnabled
                  ? 'Customers can add to cart and checkout. Toggle off to pause all orders and redirect visitors to your affiliate content.'
                  : 'Orders are paused. The cart checkout button is hidden and replaced with an affiliate redirect message. Blog and banners remain fully active.'
                }
              </p>
            </div>
          </div>

          {/* Big Toggle Switch */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, ordersEnabled: !prev.ordersEnabled }))}
            className={`relative flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shrink-0 border-2 ${
              formData.ordersEnabled
                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                : 'bg-white text-amber-600 border-amber-400 hover:bg-amber-50'
            }`}
          >
            <Power size={18} />
            {formData.ordersEnabled ? 'Pause Orders' : 'Enable Orders'}
          </button>
        </div>

        {/* Visual status indicator */}
        <div className={`mt-4 pt-4 border-t flex flex-wrap gap-3 text-xs font-semibold ${
          formData.ordersEnabled ? 'border-green-200' : 'border-amber-200'
        }`}>
          {[
            { label: 'Cart Drawer', active: formData.ordersEnabled },
            { label: 'Checkout Page', active: formData.ordersEnabled },
            { label: 'Cart Page Checkout Button', active: formData.ordersEnabled },
            { label: 'Blog & Articles', active: true },
            { label: 'Affiliate Banners', active: true },
          ].map(item => (
            <span key={item.label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {item.active ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ─── GENERAL SETTINGS ─── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">General Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  required
                  type="text"
                  value={formData.storeName}
                  onChange={e => setFormData({...formData, storeName: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  required
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Checkout & Tax</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.taxRate}
                  onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flat Shipping Fee</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.flatShippingFee}
                  onChange={e => setFormData({...formData, flatShippingFee: Number(e.target.value)})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-gray-100">
            {saveSuccess && (
              <span className="flex items-center gap-2 text-green-600 text-sm font-semibold animate-in fade-in">
                <CheckCircle2 size={16} /> Settings saved successfully!
              </span>
            )}
            <div className="ml-auto">
              <button
                disabled={saving}
                type="submit"
                className="bg-brand-orange text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 flex items-center gap-2 transition-colors"
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
