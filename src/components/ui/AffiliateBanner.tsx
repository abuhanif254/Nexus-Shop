"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";

interface AffiliateBannerProps {
  position: string;
  className?: string;
  /** Layout style:
   * - 'horizontal': wide strip (home promo, shop top)
   * - 'vertical': tall card (sidebar)
   * - 'card': compact square card (in-article, between posts)
   */
  layout?: "horizontal" | "vertical" | "card";
}

interface BannerData {
  id: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  image: string;
  link: string;
  position: string;
  order: number;
}

export default function AffiliateBanner({ position, className = "", layout = "card" }: AffiliateBannerProps) {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`/api/banners?position=${encodeURIComponent(position)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setBanners(d.data);
      })
      .catch(() => {});
  }, [position]);

  // Auto-rotate if multiple banners for same position
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const b = banners[current];

  // ─── HORIZONTAL (wide strip — promo_strip, shop top) ───
  if (layout === "horizontal") {
    return (
      <a
        href={b.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`group relative w-full overflow-hidden rounded-2xl flex items-center bg-brand-dark shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src={b.image} alt={b.title || "Affiliate Deal"} fill className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
          <div className="flex-1">
            {b.title && (
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                {b.title}
              </h3>
            )}
            {b.subtitle && (
              <p className="text-gray-300 text-sm leading-relaxed">{b.subtitle}</p>
            )}
          </div>
          {b.buttonText && (
            <span className="shrink-0 inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-3 rounded-xl group-hover:bg-orange-500 group-hover:-translate-y-0.5 transition-all shadow-lg shadow-orange-500/30 text-sm">
              <Sparkles size={15} />
              {b.buttonText}
              <ExternalLink size={13} />
            </span>
          )}
        </div>

        {/* Sponsored badge */}
        <span className="absolute top-3 right-3 text-[9px] font-bold text-white/40 uppercase tracking-widest">Sponsored</span>

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, i) => (
              <button key={i} onClick={e => { e.preventDefault(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-brand-orange" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        )}
      </a>
    );
  }

  // ─── VERTICAL (sidebar card) ───
  if (layout === "vertical") {
    return (
      <a
        href={b.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`group relative block w-full overflow-hidden rounded-2xl bg-brand-dark shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image src={b.image} alt={b.title || "Affiliate Deal"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
          <span className="absolute top-2 right-2 text-[9px] font-bold text-white/50 uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-full">Ad</span>
        </div>

        {/* Content */}
        <div className="p-4">
          {b.title && (
            <h4 className="font-black text-white text-base leading-snug mb-1 group-hover:text-brand-orange transition-colors">
              {b.title}
            </h4>
          )}
          {b.subtitle && (
            <p className="text-gray-400 text-xs leading-relaxed mb-3">{b.subtitle}</p>
          )}
          {b.buttonText && (
            <span className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-bold px-4 py-2.5 rounded-xl text-sm group-hover:bg-orange-500 transition-colors">
              <Sparkles size={13} />
              {b.buttonText}
            </span>
          )}
        </div>
      </a>
    );
  }

  // ─── CARD (default — in-article, between posts) ───
  return (
    <a
      href={b.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`group relative flex gap-4 items-center w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-brand-dark border border-gray-800 hover:border-brand-orange/40 shadow-md hover:shadow-xl transition-all duration-300 p-4 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-800">
        <Image src={b.image} alt={b.title || "Deal"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold text-brand-orange/70 uppercase tracking-widest mb-1 block">Sponsored Deal</span>
        {b.title && (
          <h4 className="font-black text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-brand-orange transition-colors mb-1">
            {b.title}
          </h4>
        )}
        {b.subtitle && (
          <p className="text-gray-400 text-xs line-clamp-1 mb-2">{b.subtitle}</p>
        )}
        {b.buttonText && (
          <span className="inline-flex items-center gap-1.5 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-orange-500 transition-colors">
            <Sparkles size={11} />
            {b.buttonText}
            <ExternalLink size={10} />
          </span>
        )}
      </div>
    </a>
  );
}
