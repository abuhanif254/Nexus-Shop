"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import QuickViewModal from '@/components/ui/QuickViewModal';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/utils/haptics';

interface ProductCardProps {
  id: number | string;
  discount: number;
  featured?: boolean;
  image: string;
  brand: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  vendor: string;
  soldCount: number;
  totalStock: number;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({
  id,
  discount,
  featured,
  image,
  brand,
  title,
  rating,
  reviews,
  price,
  oldPrice,
  vendor,
  soldCount,
  totalStock,
  viewMode = 'grid',
}: ProductCardProps) {
  const { addItemToCart, toggleWishlist, wishlist } = useCartStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const progressPercentage = (soldCount / totalStock) * 100;
  
  const isWishlisted = wishlist.some(item => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (totalStock === 0) return;
    addItemToCart({ id, title, price, image, brand });
    triggerHaptic('success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, title, price, image, brand });
    triggerHaptic('light');
  };

  return (
    <motion.div 
      whileHover={viewMode === 'grid' ? { y: -4 } : { x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 md:p-4 relative group shadow-sm hover:shadow-premium transition-all duration-300 ${viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6 items-center' : ''}`}
    >
      {/* Badges */}
      <div className="flex gap-2 absolute top-5 left-5 z-20">
        <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-2 py-0.5 text-[10px] font-bold rounded-md shadow-sm">
          -{discount}%
        </span>
        {featured && (
          <span className="bg-green-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-md shadow-sm">
            FEATURED
          </span>
        )}
        {totalStock === 0 && (
          <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-md shadow-sm">
            SOLD OUT
          </span>
        )}
      </div>

      {/* Image Container with Hover Actions */}
      <div className={`relative ${viewMode === 'grid' ? 'mb-4' : 'w-full sm:w-64 shrink-0'} group/image`}>
        <Link href={`/product/${title.toLowerCase().replace(/ /g, '-')}`} className="block relative aspect-square overflow-hidden rounded-xl bg-[#F8F9FA] dark:bg-[#151515]">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={featured}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
              [Image: {image}]
            </div>
          )}
          
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleToggleWishlist} 
            className={`p-2 bg-white/90 backdrop-blur-md dark:bg-gray-800/90 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all outline-none ${isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-brand-orange'}`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }} 
            className="p-2 bg-white/90 backdrop-blur-md dark:bg-gray-800/90 rounded-full shadow-sm hover:scale-110 active:scale-95 hover:text-brand-orange transition-all text-gray-600 dark:text-gray-300 outline-none"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Quick Add Bottom Pill */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button 
            onClick={handleAddToCart} 
            disabled={totalStock === 0} 
            className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-premium outline-none active:scale-95 transition-all duration-300 hover:-translate-y-0.5 ${totalStock === 0 ? 'bg-gray-400 text-white cursor-not-allowed hover:translate-y-0' : 'bg-white/95 backdrop-blur-md dark:bg-gray-800/95 text-brand-dark dark:text-white hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white hover:shadow-premium-hover'}`}
          >
            <ShoppingCart size={16} /> {totalStock === 0 ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className={`space-y-1.5 px-1 ${viewMode === 'list' ? 'flex-1 py-2 w-full' : ''}`}>
        <p className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">{brand}</p>
        <Link href={`/product/${title.toLowerCase().replace(/ /g, '-')}`} className="block">
          <h4 className="text-sm md:text-base text-brand-dark dark:text-gray-200 font-bold hover:text-brand-orange transition-colors line-clamp-2 min-h-[44px] leading-snug">
            {title}
          </h4>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < Math.floor(rating) ? "" : "text-gray-300 dark:text-gray-600"} />
            ))}
          </div>
          <span className="text-[11px] text-gray-500 font-medium">({reviews})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-brand-dark dark:text-white font-black text-lg md:text-xl">${price?.toFixed(2)}</span>
          {oldPrice != null && (
            <span className="text-gray-400 text-xs font-medium line-through">${oldPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Progress Bar & Stock Alert */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex justify-between items-center text-[11px] font-semibold mb-2">
            <span className="text-gray-500">Sold: {soldCount}</span>
            {totalStock > 0 && totalStock < 10 ? (
              <span className="text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded">Only {totalStock} left</span>
            ) : totalStock === 0 ? (
              <span className="text-red-500">Sold Out</span>
            ) : (
              <span className="text-gray-400">Stock: {totalStock}</span>
            )}
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1 overflow-hidden">
            <div className="bg-brand-orange h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={{ id, title, price, oldPrice, image, brand, rating, reviews }} 
      />
    </motion.div>
  );
}
