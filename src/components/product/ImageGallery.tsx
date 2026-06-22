"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0, backgroundPosition: '50% 50%' });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      opacity: 1,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ opacity: 0, backgroundPosition: '50% 50%' });
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Using a fallback placeholder if the URL is relative and image doesn't exist
  // In a real app with real image URLs from DB, we wouldn't need this wrapper
  const getSafeImageUrl = (url: string, index: number) => {
    if (url.startsWith('/mock-')) {
      return `https://placehold.co/800x800/f9fafb/9ca3af?text=Product+Image+${index + 1}`;
    }
    return url;
  };

  const activeImageUrl = getSafeImageUrl(images[activeIndex], activeIndex);

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0 pb-2 md:pb-0">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-50 dark:bg-[#151515] transition-all relative ${i === activeIndex ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'}`}
          >
            <Image 
              src={getSafeImageUrl(img, i)} 
              alt={`Thumbnail ${i+1}`} 
              fill 
              sizes="96px"
              className="object-cover" 
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="relative w-full aspect-square bg-gray-50 dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group">
        <div 
          ref={imageRef}
          className="absolute inset-0 cursor-crosshair z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* The Base Image */}
        <Image 
          src={activeImageUrl} 
          alt="Product Main Image" 
          fill 
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          unoptimized
        />

        <div 
          className="absolute inset-0 pointer-events-none z-20 md:block hidden transition-opacity duration-300"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${activeImageUrl})`,
            backgroundSize: '250%', // 2.5x zoom
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent'
          }}
        />

        {/* Mobile Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-md md:hidden z-30 active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-md md:hidden z-30 active:scale-95 transition-transform"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Sale Badge */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">Sale</span>
        </div>
      </div>
    </div>
  );
}
