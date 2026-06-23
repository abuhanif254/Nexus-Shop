"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export type GalleryItem = { url: string; type?: 'image' | 'video' | '360' };

interface ImageGalleryProps {
  items: GalleryItem[] | string[];
}

export default function ImageGallery({ items }: ImageGalleryProps) {
  // Normalize items to GalleryItem array
  const normalizedItems: GalleryItem[] = items.map(item => 
    typeof item === 'string' ? { url: item, type: 'image' } : item
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0, backgroundPosition: '50% 50%' });
  const imageRef = useRef<HTMLDivElement>(null);

  const activeItem = normalizedItems[activeIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || activeItem.type !== 'image') return;
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
    setActiveIndex((prev) => (prev + 1) % normalizedItems.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? normalizedItems.length - 1 : prev - 1));
  };

  const getSafeImageUrl = (url: string, index: number) => {
    if (url.startsWith('/mock-')) {
      return `https://placehold.co/800x800/f8f9fa/9ca3af?text=Product+Image+${index + 1}`;
    }
    return url;
  };

  const activeMediaUrl = getSafeImageUrl(activeItem.url, activeIndex);

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0 pb-2 md:pb-0">
        {normalizedItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#151515] transition-all relative group ${i === activeIndex ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'}`}
          >
            <Image 
              src={getSafeImageUrl(item.url, i)} 
              alt={`Thumbnail ${i+1}`} 
              fill 
              sizes="96px"
              className={`object-cover ${item.type !== 'image' ? 'opacity-50' : ''}`} 
              unoptimized
            />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-brand-orange transition-colors">
                   <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                 </div>
              </div>
            )}
            {item.type === '360' && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                360°
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image with Zoom or Video Player */}
      <div className="relative w-full aspect-square bg-[#F8F9FA] dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group">
        
        {activeItem.type === 'image' ? (
          <>
            <div 
              ref={imageRef}
              className="absolute inset-0 cursor-crosshair z-10"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            <Image 
              src={activeMediaUrl} 
              alt="Product Main Media" 
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
                backgroundImage: `url(${activeMediaUrl})`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent'
              }}
            />
          </>
        ) : activeItem.type === 'video' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
            <Image src={activeMediaUrl} alt="Video Poster" fill className="object-cover opacity-50 blur-sm" unoptimized />
            <div className="relative z-10 w-20 h-20 bg-brand-orange/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,107,0,0.4)]">
              <Play size={32} className="text-white ml-2" fill="currentColor" />
            </div>
            <p className="relative z-10 text-white font-bold mt-4 tracking-widest text-sm uppercase">Play Video</p>
          </div>
        ) : (
           <div className="w-full h-full flex flex-col items-center justify-center bg-[#151515] relative">
            <Image src={activeMediaUrl} alt="360 Poster" fill className="object-cover opacity-70" unoptimized />
            <div className="relative z-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 border border-white/10 cursor-pointer hover:bg-black/80 transition-colors">
              Drag to rotate 360°
            </div>
          </div>
        )}

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
