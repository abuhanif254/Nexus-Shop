"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopHeroBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/banners?position=shop')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setBanners(data.data);
        } else {
          setBanners([
            { id: '1', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070', link: '/shop' }
          ]);
        }
      });
  }, []);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  if (banners.length === 0) return <div className="h-[250px] md:h-[350px] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse mb-8"></div>;

  return (
    <div 
      className="relative w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden bg-[#1A1A1A] shadow-xl mb-8 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full cursor-pointer"
        >
          <Link href={banners[currentSlide].link} className="block w-full h-full relative">
            <Image 
              src={banners[currentSlide].image} 
              alt={`Banner ${currentSlide + 1}`} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
          </Link>
        </motion.div>
      </AnimatePresence>
      
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${index === currentSlide ? 'bg-brand-orange w-8 shadow-sm' : 'bg-white/70 w-2 hover:bg-white'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
