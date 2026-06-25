"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

interface BannerData {
  id: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  image: string;
  link: string;
  order: number;
}

/**
 * PromoBanner — Home page full-width strip.
 * Fetches position=promo_strip from DB first.
 * Falls back to the hardcoded static banner if nothing is in the DB.
 */
export default function PromoBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/banners?position=promo_strip')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.length > 0) setBanner(d.data[0]);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // ── DB Banner ──
  if (loaded && banner) {
    return (
      <div className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12">
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group w-full relative overflow-hidden bg-brand-dark rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-300 flex items-center"
        >
          {/* Background image */}
          {banner.image && (
            <>
              <Image
                src={banner.image}
                alt={banner.title || "Affiliate Promo"}
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-brand-dark/20" />
            </>
          )}

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-20 right-20 w-60 h-60 bg-orange-300 rounded-full blur-3xl group-hover:translate-x-10 transition-transform duration-1000" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-10 md:px-12 md:py-8 min-h-[140px] gap-6 text-center md:text-left w-full">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center justify-center md:justify-start gap-2 text-brand-orange font-bold mb-2 tracking-widest text-xs uppercase">
                <Sparkles size={14} />
                <span>Exclusive Affiliate Deal</span>
              </div>
              {banner.title && (
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-black leading-tight">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="text-gray-300 text-sm mt-2">{banner.subtitle}</p>
              )}
            </div>

            {banner.buttonText && (
              <div className="flex-shrink-0 relative z-20 mt-4 md:mt-0">
                <span className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold group-hover:bg-orange-500 group-hover:-translate-y-1 group-hover:shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm">
                  <Sparkles size={16} />
                  {banner.buttonText}
                  <ExternalLink size={15} />
                </span>
              </div>
            )}
          </div>

          <span className="absolute bottom-2 right-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Sponsored</span>
        </a>
      </div>
    );
  }

  // ── Static Fallback (shown while loading OR if no DB banner) ──
  return (
    <div className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12">
      <div className="w-full relative overflow-hidden bg-brand-orange rounded-xl shadow-premium hover:shadow-premium-hover transition-shadow duration-300 group">

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-20 right-20 w-60 h-60 bg-white rounded-full mix-blend-overlay blur-3xl group-hover:translate-x-10 transition-transform duration-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-10 md:px-12 md:py-8 min-h-[140px] gap-6 text-center md:text-left">

          {/* Text Content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-300 font-bold mb-2 tracking-widest text-xs uppercase">
              <Sparkles size={14} />
              <span>Bay Press Special Offer</span>
            </div>
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide leading-tight">
              Womens &amp; Mens Clothes <br className="hidden md:block" /> Sale Up To 70% Off
            </h2>
          </div>

          {/* Call to Action */}
          <div className="flex-shrink-0 relative z-20 mt-4 md:mt-0">
            <Link
              href="/category/fashion-clothing"
              className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all flex items-center justify-center gap-3 group/btn uppercase tracking-wider text-sm"
            >
              Shop Now
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
