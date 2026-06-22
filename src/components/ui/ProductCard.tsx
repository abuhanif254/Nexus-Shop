"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import QuickViewModal from '@/components/ui/QuickViewModal';
import { motion } from 'framer-motion';

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
}: ProductCardProps) {
  const { addItemToCart, toggleWishlist, wishlist } = useCartStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const progressPercentage = (soldCount / totalStock) * 100;
  
  const isWishlisted = wishlist.some(item => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (totalStock === 0) return;
    addItemToCart({ id, title, price, image, brand });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({ id, title, price, image, brand });
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-xl p-4 md:p-5 relative group hover:shadow-2xl dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] transition-shadow duration-300"
    >
      {/* Badges */}
      <div className="flex gap-2 absolute top-4 left-4 z-10">
        <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs font-bold rounded-full shadow-sm">
          -{discount}%
        </span>
        {featured && (
          <span className="bg-white dark:bg-gray-800 text-green-500 border border-green-500 px-2 py-0.5 text-xs font-bold rounded-full shadow-sm">
            FEATURED
          </span>
        )}
        {totalStock === 0 && (
          <span className="bg-red-500 text-white border border-red-600 px-2 py-0.5 text-xs font-bold rounded-full shadow-sm">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Image Placeholder */}
      <Link href={`/product/${title.toLowerCase().replace(/ /g, '-')}`} className="block relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
        {image && image.startsWith('/') ? (
          <Image 
            src={image} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            [Image: {image}]
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={totalStock === 0}
            className={`text-white p-3 rounded-full shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 ${totalStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-orange hover:bg-orange-600'}`}
            title={totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-[50ms] hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Quick View"
          >
            <Eye size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleWishlist}
            className={`bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-100 hover:bg-gray-50 dark:hover:bg-gray-700 ${isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
            title="Wishlist"
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>
        </div>
      </Link>

      {/* Details */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-800 dark:text-gray-400 uppercase tracking-wide">{brand}</p>
        <Link href={`/product/${title.toLowerCase().replace(/ /g, '-')}`} className="block">
          <h4 className="text-sm text-gray-700 dark:text-gray-200 font-semibold hover:text-brand-orange transition-colors line-clamp-2 min-h-[40px]">
            {title}
          </h4>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < Math.floor(rating) ? "" : "text-gray-300 dark:text-gray-600"} />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">{reviews}</span>
        </div>

        {/* Pricing */}
        <div className="flex items-end gap-2 mt-2">
          <span className="text-brand-orange font-bold text-xl">${price.toFixed(2)}</span>
          <span className="text-gray-400 text-xs line-through pb-1">${oldPrice.toFixed(2)}</span>
        </div>

        {/* Vendor */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vendor: <span className="text-gray-700 dark:text-gray-300">{vendor}</span></p>

        {/* Progress Bar & Stock Alert */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-gray-700 dark:text-gray-400">Sold: {soldCount}</span>
            {totalStock > 0 && totalStock < 10 ? (
              <span className="text-red-500 font-bold">Only {totalStock} left!</span>
            ) : totalStock === 0 ? (
              <span className="text-red-500 font-bold">Sold Out</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-500">In Stock: {totalStock}</span>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-orange h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
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
