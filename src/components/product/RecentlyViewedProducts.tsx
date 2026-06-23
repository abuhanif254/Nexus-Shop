"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RecentlyViewedProducts() {
  const [mounted, setMounted] = useState(false);
  const { viewedItems } = useRecentlyViewedStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || viewedItems.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Recently Viewed</h2>
            <p className="text-sm text-gray-500">Pick up where you left off</p>
          </div>
          <Link href="/search" className="text-brand-orange font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {viewedItems.slice(0, 6).map((item) => (
            <ProductCard 
              key={item.id} 
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              brand={item.brand}
              rating={5}
              reviews={0}
              discount={0}
              oldPrice={0}
              vendor="Besa"
              soldCount={0}
              totalStock={10}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
