"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "ADODES ORIGINALS & BOOST\nSHOES SALE ONLINE UK",
    subtitle: "Adidas Official",
    promo: "50% OFF - Shop Shoes",
    bgClass: "bg-gray-50 dark:bg-[#151515]",
    buttonText: "Shop Now",
    buttonLink: "/shop"
  },
  {
    id: 2,
    title: "MACBOOK PRO M3 MAX\nPOWERING INNOVATION",
    subtitle: "Apple Store",
    promo: "Save $200 Today",
    bgClass: "bg-blue-50 dark:bg-blue-950/20",
    buttonText: "Discover Pro",
    buttonLink: "/category/electronics"
  },
  {
    id: 3,
    title: "MODERN LIVING ROOM\nFURNITURE COLLECTION",
    subtitle: "Home & Lifestyle",
    promo: "Up to 30% OFF",
    bgClass: "bg-orange-50 dark:bg-orange-950/20",
    buttonText: "Decorate Now",
    buttonLink: "/category/home"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Main Promo Carousel */}
      <div className={`h-[500px] lg:h-[600px] rounded-2xl flex items-center justify-between px-8 lg:px-16 relative overflow-hidden group transition-colors duration-700 border border-gray-100 dark:border-gray-800 shadow-sm ${slides[currentSlide].bgClass}`}>
        
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 flex items-center justify-between px-8 lg:px-16 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <div className={`max-w-xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <p className="text-brand-orange font-bold mb-3 text-sm uppercase tracking-widest">{slide.subtitle}</p>
              <h2 className="text-4xl lg:text-[4rem] font-black text-gray-900 dark:text-white mb-6 leading-[1.05] whitespace-pre-line tracking-tighter">
                {slide.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl mb-8 font-medium tracking-wide">{slide.promo}</p>
              <Link href={slide.buttonLink} className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 inline-block shadow-[0_8px_30px_rgba(249,78,48,0.3)] dark:shadow-[0_8px_30px_rgba(249,78,48,0.15)] hover:-translate-y-1 active:scale-95">
                {slide.buttonText}
              </Link>
            </div>
            
            <div className={`hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 transition-all duration-1000 transform ${index === currentSlide ? 'scale-100 opacity-100 translate-x-0' : 'scale-90 opacity-0 translate-x-12'}`}>
              <div className="w-[500px] h-[400px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-2xl">
                 [Hero Image {slide.id}]
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/60 backdrop-blur flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/60 backdrop-blur flex items-center justify-center shadow-lg rounded-full text-gray-800 dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-brand-orange w-8' : 'bg-gray-300 dark:bg-gray-600 w-2.5 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3 Sub Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Banner 1 */}
        <div className="bg-brand-dark h-[220px] rounded-2xl relative overflow-hidden flex items-center group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
           <div className="z-20 pl-8 text-white">
             <p className="text-sm text-gray-400 mb-2 font-medium tracking-wide">NEW COLLECTION</p>
             <h3 className="text-2xl lg:text-3xl font-black mb-6 uppercase leading-[1.1] max-w-[200px] tracking-tight">Top Street Style<br/>Must Have</h3>
             <span className="text-xs font-bold uppercase tracking-widest text-brand-orange group-hover:text-white transition-colors flex items-center gap-1">Feature Today <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
        </div>

        {/* Banner 2 */}
        <div className="bg-brand-orange h-[220px] rounded-2xl relative overflow-hidden flex items-center justify-between group cursor-pointer hover:shadow-[0_20px_40px_rgba(249,78,48,0.2)] dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1">
           <div className="z-20 pl-8 text-white max-w-[180px]">
             <p className="text-sm text-orange-200 mb-2 font-medium tracking-wide">TODAY SPECIAL</p>
             <h3 className="text-2xl lg:text-3xl font-black mb-6 uppercase leading-[1.1] tracking-tight">Smart Devices<br/>Sale</h3>
             <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-gray-100 transition-colors flex items-center gap-1">Shop now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
           <div className="w-[120px] h-[160px] bg-white/10 backdrop-blur-sm mr-6 rounded-xl flex items-center justify-center text-orange-200 border border-white/20">
             [Tech]
           </div>
        </div>

        {/* Banner 3 */}
        <div className="bg-gray-100 dark:bg-gray-800 h-[220px] rounded-2xl relative overflow-hidden flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
           <div className="z-20 pl-8 text-gray-900 dark:text-white max-w-[180px]">
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wide">TRENDING</p>
             <h3 className="text-2xl lg:text-3xl font-black mb-6 uppercase leading-[1.1] tracking-tight">Online Shopping<br/>Fashion</h3>
             <span className="text-xs font-bold uppercase tracking-widest text-brand-orange transition-colors flex items-center gap-1">Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
           </div>
           <div className="w-[100px] h-[180px] bg-white dark:bg-gray-900 mr-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600">
             [Fashion]
           </div>
        </div>
      </div>
    </div>
  );
}
