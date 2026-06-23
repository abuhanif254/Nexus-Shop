"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "ADODES ORIGINALS\n& BOOST SHOES",
    subtitle: "Adidas Official",
    promo: "50% OFF - Shop Shoes Online UK",
    bgClass: "bg-[#F8F9FA] dark:bg-[#121212]",
    buttonText: "Shop Now",
    buttonLink: "/shop"
  },
  {
    id: 2,
    title: "MACBOOK PRO M3\nMAX INNOVATION",
    subtitle: "Apple Store",
    promo: "Save $200 Today on Pro Models",
    bgClass: "bg-[#F4F7FB] dark:bg-[#0A101D]",
    buttonText: "Discover Pro",
    buttonLink: "/category/electronics"
  },
  {
    id: 3,
    title: "MODERN LIVING\nFURNITURE SALE",
    subtitle: "Home & Lifestyle",
    promo: "Up to 30% OFF Premium Decor",
    bgClass: "bg-[#FDF6F0] dark:bg-[#1A120B]",
    buttonText: "Decorate Now",
    buttonLink: "/category/home"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.4 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Main Promo Carousel */}
      <div 
        className={`h-[500px] lg:h-[600px] rounded-[2rem] flex items-center relative overflow-hidden group transition-colors duration-700 border border-transparent dark:border-gray-800/50 ${slides[currentSlide].bgClass}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20"
          >
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 max-w-xl flex flex-col justify-center h-full z-10 pt-10 lg:pt-0">
              <motion.p variants={itemVariants} className="text-brand-orange font-bold mb-4 text-[11px] lg:text-xs uppercase tracking-[0.2em]">
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.h2 variants={itemVariants} className="text-4xl lg:text-[4.5rem] font-black text-gray-900 dark:text-white mb-6 leading-[1.05] whitespace-pre-line tracking-tight">
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-base lg:text-xl mb-10 font-medium tracking-wide max-w-md">
                {slides[currentSlide].promo}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href={slides[currentSlide].buttonLink} className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 inline-flex items-center gap-3 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 active:scale-95 text-sm lg:text-base">
                  {slides[currentSlide].buttonText} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
            
            {/* Right: Product Showcase */}
            <div className="hidden lg:flex w-full lg:w-1/2 h-full items-center justify-end relative z-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-[90%] h-[80%] bg-white/60 dark:bg-black/20 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/5 flex items-center justify-center relative overflow-hidden"
              >
                <div className="text-gray-400 dark:text-gray-600 font-bold tracking-widest uppercase text-sm">
                  [Hero Showcase {slides[currentSlide].id}]
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${index === currentSlide ? 'bg-brand-orange w-10 shadow-sm' : 'bg-gray-300 dark:bg-gray-700 w-2.5 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3 Sub Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner 1 */}
        <div className="bg-brand-dark dark:bg-[#151515] h-[240px] rounded-[2rem] relative overflow-hidden flex items-center group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-transparent dark:border-gray-800">
           <div className="z-20 px-8 text-white">
             <p className="text-[11px] text-gray-400 mb-3 font-bold tracking-widest">NEW COLLECTION</p>
             <h3 className="text-2xl lg:text-[1.75rem] font-black mb-6 uppercase leading-[1.1] max-w-[200px] tracking-tight">Top Street Style<br/>Must Have</h3>
             <span className="text-[11px] font-bold uppercase tracking-widest text-brand-orange group-hover:text-white transition-colors flex items-center gap-2">Feature Today <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
        </div>

        {/* Banner 2 */}
        <div className="bg-brand-orange h-[240px] rounded-[2rem] relative overflow-hidden flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
           <div className="z-20 px-8 text-white max-w-[180px]">
             <p className="text-[11px] text-orange-200 mb-3 font-bold tracking-widest">TODAY SPECIAL</p>
             <h3 className="text-2xl lg:text-[1.75rem] font-black mb-6 uppercase leading-[1.1] tracking-tight">Smart Devices<br/>Sale</h3>
             <span className="text-[11px] font-bold uppercase tracking-widest text-white transition-colors flex items-center gap-2 opacity-90 group-hover:opacity-100">Shop now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
           <div className="w-[110px] h-[160px] bg-white/10 backdrop-blur-md mr-8 rounded-2xl flex items-center justify-center text-orange-100 border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-500 text-sm font-bold tracking-wider">
             [Tech]
           </div>
        </div>

        {/* Banner 3 */}
        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] h-[240px] rounded-[2rem] relative overflow-hidden flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-transparent dark:border-gray-800">
           <div className="z-20 px-8 text-brand-dark dark:text-white max-w-[180px]">
             <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 font-bold tracking-widest">TRENDING</p>
             <h3 className="text-2xl lg:text-[1.75rem] font-black mb-6 uppercase leading-[1.1] tracking-tight">Online Shopping<br/>Fashion</h3>
             <span className="text-[11px] font-bold uppercase tracking-widest text-brand-orange transition-colors flex items-center gap-2">Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
           <div className="w-[100px] h-[180px] bg-white dark:bg-[#111111] mr-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 group-hover:scale-105 transition-transform duration-500 text-sm font-bold tracking-wider">
             [Fashion]
           </div>
        </div>
      </div>
    </div>
  );
}
