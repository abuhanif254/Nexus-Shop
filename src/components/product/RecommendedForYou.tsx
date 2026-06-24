"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useCartStore } from "@/store/useCartStore";

export default function RecommendedForYou() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { viewedItems } = useRecentlyViewedStore();
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchRecommended = async () => {
      try {
        // Simple personalization logic: 
        // 1. Get categories from viewed items and cart items
        const categories = new Set<string>();
        viewedItems.forEach(item => categories.add(item.category));
        cartItems.forEach(item => {
           // We might not have category in cart item depending on the type, but let's assume we do or we just use general search if none
           if ((item as any).category) categories.add((item as any).category);
        });

        // If we don't have enough data, just fetch popular/default items
        const targetCategory = categories.size > 0 ? Array.from(categories)[0] : '';
        
        const params = new URLSearchParams();
        if (targetCategory) params.set('category', targetCategory);
        params.set('sort', 'popular'); // Show popular items from that category

        const res = await fetch(`/api/search?${params.toString()}`);
        const result = await res.json();
        
        if (result.success) {
          // Filter out items the user already viewed or has in cart to show *new* recommendations
          const viewedIds = new Set(viewedItems.map(i => i.id));
          const cartIds = new Set(cartItems.map(i => String(i.id)));
          
          const recommended = result.data
            .filter((p: any) => !viewedIds.has(p.id) && !cartIds.has(p.id))
            .slice(0, 4);
            
          setProducts(recommended);
        }
      } catch (error) {
        console.error("Failed to fetch recommended products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [mounted, viewedItems, cartItems]);

  if (!mounted) return null;

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Recommended For You</h2>
          <p className="text-sm text-gray-500 mb-8">Personalized picks based on your activity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 animate-in fade-in slide-in-from-bottom-4">Recommended For You</h2>
        <p className="text-sm text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-4">Personalized picks based on your activity</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
