"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { motion } from "framer-motion";

interface FetchedProduct {
  id: string;
  featured: boolean | null;
  image: string;
  brand: string;
  title: string;
  rating: number | null;
  reviews: number | null;
  price: number;
  oldPrice: number | null;
  discount: number | null;
}

export default function RecommendedProducts({ initialProducts = [] }: { initialProducts?: any[] }) {
  // Shuffle and pick exactly 5 for the asymmetric grid layout
  const [products, setProducts] = useState(() => {
    return initialProducts.slice(0, 5);
  });

  useEffect(() => {
    const shuffled = [...initialProducts].sort(() => 0.5 - Math.random());
    setProducts(shuffled.slice(0, 5));
  }, [initialProducts]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
          Recommended For You
        </h2>
      </div>

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
    </div>
  );
}
