"use client";

import { useState } from "react";
import { MapPin, Edit, Trash2, Star, Plus } from "lucide-react";
import AddressModal from "./AddressModal";
import { useRouter } from "next/navigation";

export default function AddressListClient({ initialAddresses }: { initialAddresses: any[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        router.refresh();
      }
    } catch (err) {
      alert("Error deleting address");
    }
  };

  const handleSetDefault = async (address: any) => {
    if (address.isDefault) return;
    try {
      const res = await fetch(`/api/account/addresses/${address.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, isDefault: true })
      });
      if (res.ok) {
        // Update local state for immediate feedback
        setAddresses(prev => prev.map(a => ({
          ...a,
          isDefault: a.id === address.id
        })));
        router.refresh();
      }
    } catch (err) {
      alert("Error setting default address");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No saved addresses found.
          </div>
        )}
        
        {addresses.map((address) => (
          <div key={address.id} className={`p-5 rounded-xl border relative ${address.isDefault ? 'border-brand-orange bg-orange-50/20 shadow-sm' : 'border-gray-200 bg-white'}`}>
            {address.isDefault && (
              <span className="absolute top-4 right-4 bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={10} fill="currentColor" /> Default
              </span>
            )}
            
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2 rounded-lg ${address.isDefault ? 'bg-orange-100 text-brand-orange' : 'bg-gray-100 text-gray-500'}`}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{address.fullName}</h3>
                <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {address.addressLine1} <br />
                  {address.city}, {address.postalCode} <br />
                  {address.country}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => handleEdit(address)} className="text-sm font-semibold text-gray-600 hover:text-brand-orange transition-colors flex items-center gap-1 px-2 py-1">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(address.id)} className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1">
                <Trash2 size={14} /> Delete
              </button>
              {!address.isDefault && (
                <button onClick={() => handleSetDefault(address)} className="text-sm font-semibold text-gray-600 hover:text-brand-orange transition-colors ml-auto">
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          router.refresh();
        }} 
        address={editingAddress} 
      />
    </div>
  );
}
