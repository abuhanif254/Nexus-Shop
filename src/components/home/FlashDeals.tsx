"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { useCountdown } from "@/hooks/useCountdown";

// Types for fetched products
interface FetchedProduct {
  id: string;
  discount: number | null;
  featured: boolean;
  image: string;
  brand: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number | null;
  vendor: string | null;
  soldCount: number | null;
  totalStock: number | null;
}

export default function FlashDeals({ initialProducts = [] }: { initialProducts?: any[] }) {
  const [mounted, setMounted] = useState(false);
  
  // Set target date to 24 hours from now (for demo purposes)
  // In a real app, this would come from the backend API
  const [targetDate] = useState(() => new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const { hours, minutes, seconds } = useCountdown(targetDate);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Lightning Deals</h2>
        
        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Deals end in:</span>
          {mounted ? (
            <div className="flex items-center text-white font-bold bg-brand-orange px-3 py-1 rounded text-lg tracking-widest gap-1 min-w-[120px] justify-center">
              <span>{hours}</span>
              <span>:</span>
              <span>{minutes}</span>
              <span>:</span>
              <span>{seconds}</span>
            </div>
          ) : (
            <div className="flex items-center text-white font-bold bg-brand-orange px-3 py-1 rounded text-lg tracking-widest gap-1 min-w-[120px] justify-center opacity-50">
              -- : -- : --
            </div>
          )}
        </div>
      </div>

      {/* Products Horizontal Scroll Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {initialProducts.map((product) => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[220px] snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
