"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { PackageSearch } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  vendor: string;
  soldCount: number;
  totalStock: number;
  featured?: boolean;
}

export default function ProductGrid({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setPage(1);
      try {
        // Construct API URL with current search params
        const params = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/category/${slug}?${params.toString()}`);
        const result = await res.json();
        
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={`skeleton-initial-${i}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm text-center px-4 w-full">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <PackageSearch size={40} className="text-brand-orange" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-500 max-w-md mb-8">
          We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters to see more results.
        </p>
        <button 
          onClick={() => router.push(pathname)}
          className="px-8 py-3 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      // Simulate fetching next page
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/category/${slug}?${params.toString()}`);
      const result = await res.json();
      
      if (result.success) {
        // Mocking appending new items by duplicating for demo purposes
        const newItems = result.data.map((item: Product) => ({
          ...item,
          id: item.id + Math.random() * 10000 // Ensure unique keys
        }));
        setProducts(prev => [...prev, ...newItems]);
        setPage(p => p + 1);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
        {loadingMore && [1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={`skeleton-more-${i}`} />
        ))}
      </div>
      
      {page < 3 && (
        <button 
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="px-8 py-3 rounded-full border-2 border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMore ? 'Loading...' : 'Load More Products'}
        </button>
      )}
    </div>
  );
}
