"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Award } from "lucide-react";
import Image from "next/image";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, slug: newSlug, logo: newLogo })
      });
      const data = await res.json();
      if (data.success) {
        setNewName("");
        setNewSlug("");
        setNewLogo("");
        fetchBrands();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add brand");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="text-brand-orange" /> Brands Management
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Brand</h2>
        <form onSubmit={handleAddBrand} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input required type="text" value={newName} onChange={e => {
              setNewName(e.target.value);
              setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
            }} placeholder="e.g. Apple" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input required type="text" value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="apple" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
            <input type="url" value={newLogo} onChange={e => setNewLogo(e.target.value)} placeholder="https://..." className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="lg:col-span-1">
            <button disabled={isAdding} type="submit" className="w-full bg-brand-orange text-white p-2 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 flex items-center justify-center gap-2">
              <Plus size={18} /> {isAdding ? 'Adding...' : 'Add Brand'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4 font-medium">Logo</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading brands...</td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No brands found.</td></tr>
              ) : (
                brands.map(brand => (
                  <tr key={brand.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      {brand.logo ? (
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">None</div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{brand.name}</td>
                    <td className="p-4 text-sm text-gray-500">{brand.slug}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(brand.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
