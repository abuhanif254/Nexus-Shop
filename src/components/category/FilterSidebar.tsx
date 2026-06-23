"use client";

import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Check, Star, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brands: true,
    rating: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const currentBrand = searchParams.get('brand');
  const currentCategory = searchParams.get('category');
  const currentRating = searchParams.get('rating');

  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = useCallback(() => {
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = currentBrand || currentCategory || currentRating || searchParams.get('minPrice') || searchParams.get('maxPrice');

  return (
    <div className="bg-white dark:bg-brand-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#151515] flex justify-between items-center">
        <h3 className="font-bold text-gray-800 dark:text-gray-200">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-xs text-brand-orange hover:underline font-semibold">Clear All</button>
        )}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-b border-gray-100 dark:border-gray-800 bg-orange-50/50 dark:bg-orange-900/10"
          >
            <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 tracking-wider">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {currentCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {currentCategory}
                  <button onClick={() => updateFilters('category', null)} className="hover:text-brand-orange"><X size={12} /></button>
                </span>
              )}
              {currentBrand && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {currentBrand}
                  <button onClick={() => updateFilters('brand', null)} className="hover:text-brand-orange"><X size={12} /></button>
                </span>
              )}
              {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                  ${searchParams.get('minPrice') || '0'} - ${searchParams.get('maxPrice') || 'Any'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); updateFilters('minPrice', null); updateFilters('maxPrice', null); }} className="hover:text-brand-orange"><X size={12} /></button>
                </span>
              )}
              {currentRating && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {currentRating} Stars & Up
                  <button onClick={() => updateFilters('rating', null)} className="hover:text-brand-orange"><X size={12} /></button>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        
        {/* Categories Filter */}
        <div className="p-4">
          <button 
            className="flex justify-between items-center w-full font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3"
            onClick={() => toggleSection('categories')}
          >
            Categories {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 mt-2 overflow-hidden">
                {['Smartphones', 'Laptops', 'Audio', 'Accessories'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group" onClick={() => updateFilters('category', currentCategory === cat ? null : cat)}>
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${currentCategory === cat ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-orange'}`}>
                      {currentCategory === cat && <Check size={12} />}
                    </div>
                    <span className={`text-sm transition-colors ${currentCategory === cat ? 'text-brand-orange font-semibold' : 'text-gray-600 dark:text-gray-400 group-hover:text-brand-orange'}`}>{cat}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Filter */}
        <div className="p-4">
          <button 
            className="flex justify-between items-center w-full font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3"
            onClick={() => toggleSection('price')}
          >
            Price Range {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden">
                <div className="flex justify-between items-center mt-3 gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded-lg pl-6 pr-2 py-2 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" 
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded-lg pl-6 pr-2 py-2 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" 
                    />
                  </div>
                </div>
                <button 
                  onClick={handlePriceApply}
                  className="w-full mt-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  Apply Price
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brands Filter */}
        <div className="p-4">
          <button 
            className="flex justify-between items-center w-full font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3"
            onClick={() => toggleSection('brands')}
          >
            Brands {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.brands && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 mt-2 overflow-hidden">
                {['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus'].map((brand) => (
                  <button 
                    key={brand} 
                    onClick={() => updateFilters('brand', currentBrand === brand ? null : brand)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                      currentBrand === brand 
                        ? 'bg-brand-dark dark:bg-white border-brand-dark dark:border-white text-white dark:text-brand-dark shadow-md' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-orange hover:text-brand-orange hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
        <div className="p-4">
          <button 
            className="flex justify-between items-center w-full font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3"
            onClick={() => toggleSection('rating')}
          >
            Rating {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 mt-2 overflow-hidden">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer group" onClick={() => updateFilters('rating', currentRating === String(rating) ? null : String(rating))}>
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${currentRating === String(rating) ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-orange'}`}>
                      {currentRating === String(rating) && <Check size={12} />}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-700"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">& Up</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Mobile Sticky Apply Button */}
      <div className="lg:hidden sticky bottom-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-brand-dark p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
        <button className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
