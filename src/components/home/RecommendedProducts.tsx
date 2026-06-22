"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { motion } from "framer-motion";

interface FetchedProduct {
  id: number;
  discount: number;
  featured: boolean;
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

export default function RecommendedProducts() {
  const [products, setProducts] = useState<FetchedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          // Shuffle and pick exactly 5 for the asymmetric grid layout
          const shuffled = [...json.data].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch recommended products", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
          Recommended For You
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 h-auto">
           <div className="sm:col-span-2 sm:row-span-2">
             <ProductCardSkeleton />
           </div>
           {[...Array(4)].map((_, i) => (
             <div key={i}>
               <ProductCardSkeleton />
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 h-auto">
           {products.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
               className="sm:col-span-2 sm:row-span-2"
             >
               <ProductCard {...products[0]} featured />
             </motion.div>
           )}
           {products.slice(1).map((product, i) => (
             <motion.div 
               key={product.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
             >
               <ProductCard {...product} />
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}
