"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newImage, setNewImage] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newPosition, setNewPosition] = useState("home");
  const [newOrder, setNewOrder] = useState("0");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: newImage, link: newLink, position: newPosition, order: parseInt(newOrder) })
      });
      const data = await res.json();
      if (data.success) {
        setNewImage("");
        setNewLink("");
        setNewOrder("0");
        fetchBanners();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add banner");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ImageIcon className="text-brand-orange" /> Banners Management
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Banner</h2>
        <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input required type="url" value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="https://..." className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input required type="text" value={newLink} onChange={e => setNewLink(e.target.value)} placeholder="/category/..." className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select value={newPosition} onChange={e => setNewPosition(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange">
              <option value="home">Home Page</option>
              <option value="shop">Shop Page</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input required type="number" value={newOrder} onChange={e => setNewOrder(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <button disabled={isAdding} type="submit" className="w-full bg-brand-orange text-white p-2 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 flex items-center justify-center gap-2">
              <Plus size={18} /> {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4 font-medium">Image Preview</th>
                <th className="p-4 font-medium">Link</th>
                <th className="p-4 font-medium">Position</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading banners...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No banners found.</td></tr>
              ) : (
                banners.map(banner => (
                  <tr key={banner.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="relative w-32 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={banner.image} alt="Banner" fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 truncate max-w-[200px]">{banner.link}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase">{banner.position}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{banner.order}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
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
