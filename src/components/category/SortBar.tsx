"use client";

import { LayoutGrid, List } from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentSort = searchParams.get('sort') || 'default';

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortValue === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      
      {/* View Toggles */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
        >
          <LayoutGrid size={20} />
        </button>
        <button 
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
        >
          <List size={20} />
        </button>
        <span className="text-sm text-gray-500 ml-2 hidden sm:block">View Options</span>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label htmlFor="sort" className="text-sm text-gray-500 font-semibold whitespace-nowrap">Sort by:</label>
        <select 
          id="sort" 
          value={currentSort}
          onChange={handleSortChange}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-orange w-full sm:w-auto cursor-pointer"
        >
          <option value="default">Default Sorting</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
}
