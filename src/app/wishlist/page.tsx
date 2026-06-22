"use client";

import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItemToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 pb-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-500 mb-8">Save your favorite items here.</p>

        {wishlist.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/40 max-w-2xl mx-auto animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 mt-12">
            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8 relative group cursor-pointer hover:bg-red-100 transition-colors duration-500">
              <div className="absolute inset-0 rounded-full border border-red-200 scale-110 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
              <Heart size={56} className="text-red-500 group-hover:-translate-y-2 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
              You haven't saved any items yet. Keep track of products you love by clicking the heart icon.
            </p>
            <Link href="/" className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-[0_8px_30px_rgba(249,78,48,0.3)] hover:shadow-[0_8px_30px_rgba(249,78,48,0.5)] hover:-translate-y-1 active:scale-95 text-lg">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                  <Image 
                    src={item.image.startsWith('/') ? item.image : `/${item.image}.jpg`} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <button 
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.brand}</p>
                  <Link href={`/product/${item.title.toLowerCase().replace(/ /g, '-')}`} className="font-bold text-gray-800 hover:text-brand-orange transition-colors line-clamp-2 mb-2 flex-1">
                    {item.title}
                  </Link>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xl font-black text-gray-900">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addItemToCart(item)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-brand-orange transition-colors shadow-md"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
