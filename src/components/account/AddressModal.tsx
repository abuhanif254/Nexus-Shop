"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddressModal({ isOpen, onClose, address }: { isOpen: boolean, onClose: () => void, address?: any }) {
  const router = useRouter();
  const isEditing = !!address;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    city: address?.city || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "USA",
    isDefault: address?.isDefault || false,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/account/addresses/${address.id}` : `/api/account/addresses`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        alert("Failed to save address");
      }
    } catch (err) {
      alert("Error saving address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Address" : "Add New Address"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Full Name *</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Phone *</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Address Line 1 *</label>
            <input required name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">City *</label>
              <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Postal Code *</label>
              <input required name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Country *</label>
            <input required name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-4 h-4 accent-brand-orange" />
            <label htmlFor="isDefault" className="text-sm font-semibold text-gray-700">Set as default shipping address</label>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
