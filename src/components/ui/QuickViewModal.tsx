"use client";

import { useEffect, useState } from "react";
import { X, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import ImageGallery from "@/components/product/ImageGallery";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number | string;
    title: string;
    price: number;
    oldPrice: number;
    image: string;
    brand: string;
    rating: number;
    reviews: number;
  };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const { addItemToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand
    });
    onClose();
  };

  // Generate some mock thumbnails to demonstrate the gallery functionality
  const mockImages = [
    product.image,
    "/mock-product-1.jpg",
    "/mock-product-2.jpg",
    "/mock-product-3.jpg"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative bg-white dark:bg-[#151515] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[650px] animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-orange outline-none"
          aria-label="Close Quick View"
        >
          <X size={20} />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#111111] border-r border-gray-100 dark:border-gray-800 p-6 md:p-8 flex items-center overflow-y-auto no-scrollbar">
           <ImageGallery items={mockImages} />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <p className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-2">{product.brand}</p>
          <h2 id="quick-view-title" className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">{product.title}</h2>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300 dark:text-gray-700"} />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 underline">{product.reviews} Reviews</span>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-black text-brand-dark dark:text-white">${product.price?.toFixed(2)}</span>
            {product.oldPrice != null && product.oldPrice > product.price && (
              <span className="text-xl text-gray-400 dark:text-gray-500 line-through pb-1">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Experience premium quality with this meticulously crafted product. Designed for durability and styled for modern aesthetics, it's the perfect addition to your daily routine. Unbox excellence today.
          </p>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-brand-orange text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-[0_10px_40px_rgba(249,78,48,0.3)] dark:shadow-[0_10px_40px_rgba(249,78,48,0.15)] active:scale-95"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
