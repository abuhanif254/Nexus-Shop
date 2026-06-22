"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import AddEditProductModal from "./AddEditProductModal";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => setIsEditOpen(true)}
        className="p-2 text-gray-500 hover:text-brand-orange hover:bg-orange-50 rounded transition-colors"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>

      {isEditOpen && (
        <AddEditProductModal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          product={product} 
        />
      )}
    </div>
  );
}
