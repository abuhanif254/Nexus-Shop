"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function AddEditProductModal({ isOpen, onClose, product }: AddEditProductModalProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    category: product?.category || "",
    price: product?.price || "",
    oldPrice: product?.oldPrice || "",
    discount: product?.discount || "",
    totalStock: product?.totalStock || "",
    image: product?.image || "",
    vendor: product?.vendor || "",
    description: product?.description || "",
    featured: product?.featured || false,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/products/${product.id}` : `/api/admin/products`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Brand *</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Category *</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Vendor</label>
              <input name="vendor" value={formData.vendor} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Price ($) *</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Old Price ($)</label>
              <input type="number" step="0.01" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Total Stock *</label>
              <input required type="number" name="totalStock" value={formData.totalStock} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Image URL or Name (e.g. 'headphone') *</label>
            <input required name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea name="description" value={formData.description || ""} onChange={handleChange as any} className="w-full border border-gray-300 rounded p-2 min-h-[100px]" placeholder="Enter product description..."></textarea>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-brand-orange" />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Featured Product</label>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
