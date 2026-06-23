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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductGrid({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        
        const apiEndpoint = slug === 'search' 
          ? `/api/search?${params.toString()}` 
          : `/api/category/${slug}?${params.toString()}`;
        
        const res = await fetch(apiEndpoint);
        const result = await res.json();
        
        if (result.success) {
          setProducts(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
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
    if (!pagination || currentPage >= pagination.totalPages) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(nextPage));
      
      const apiEndpoint = slug === 'search' 
          ? `/api/search?${params.toString()}` 
          : `/api/category/${slug}?${params.toString()}`;
          
      const res = await fetch(apiEndpoint);
      const result = await res.json();
      
      if (result.success) {
        setProducts(prev => [...prev, ...result.data]);
        setPagination(result.pagination);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const currentView = searchParams.get('view') || 'grid';

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <p className="text-sm text-gray-500 font-semibold">
          Showing <span className="text-brand-orange">{products.length}</span> of {pagination?.total || products.length} results
        </p>
      </div>
      
      <div className={`w-full mb-8 ${currentView === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} viewMode={currentView as 'grid' | 'list'} />
        ))}
        {loadingMore && [1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={`skeleton-more-${i}`} />
        ))}
      </div>
      
      {pagination && currentPage < pagination.totalPages && (
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
