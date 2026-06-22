"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddEditProductModal from "./AddEditProductModal";

export default function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm"
      >
        <Plus size={18} /> Add Product
      </button>

      <AddEditProductModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
