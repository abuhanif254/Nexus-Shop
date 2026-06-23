import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FilterSidebar from "@/components/category/FilterSidebar";
import MobileFilterWrapper from "@/components/category/MobileFilterWrapper";
import SortBar from "@/components/category/SortBar";
import ProductGrid from "@/components/category/ProductGrid";
import type { Metadata } from "next";

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || 'All Products';
  
  return {
    title: `Search: ${query} | Nexus Shop`,
    description: `Search results for ${query} at Nexus Shop. Discover amazing deals on top brands.`,
  };
}

export default async function SearchPage(
  props: {
    searchParams: Promise<{ q?: string }>;
  }
) {
  const params = await props.searchParams;
  const q = params.q || '';

  return (
    <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-400">Search Results</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Search Results</h1>
            <p className="text-gray-500 text-sm">Showing results for: <span className="font-bold text-brand-orange">{q || 'All Products'}</span></p>
          </div>
        </div>

        {/* Layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <div className="w-full lg:w-1/4">
            <MobileFilterWrapper>
              <FilterSidebar />
            </MobileFilterWrapper>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
             {/* Controls */}
             <SortBar />

             {/* Grid */}
             <ProductGrid slug="search" />
          </div>
        </div>

      </div>
    </div>
  );
}
