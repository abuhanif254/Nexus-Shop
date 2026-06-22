"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft, Ghost } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full text-center">
        <FadeIn>
          {/* Animated Ghost Icon */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-brand-orange/20 blur-3xl rounded-full w-32 h-32 mx-auto animate-pulse"></div>
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center relative z-10 animate-bounce">
              <Ghost size={64} className="text-brand-orange" />
            </div>
          </div>
          
          <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter mb-4">
            4<span className="text-brand-orange">0</span>4
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Oops! Page not found.
          </h2>
          
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group"
            >
              <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          
          {/* Helpful Quick Links */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Or try these popular pages</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/category/smartphones" className="text-gray-600 hover:text-brand-orange hover:underline transition-colors px-3 py-1 bg-gray-50 rounded-full text-sm">Smartphones</Link>
              <Link href="/category/laptops" className="text-gray-600 hover:text-brand-orange hover:underline transition-colors px-3 py-1 bg-gray-50 rounded-full text-sm">Laptops</Link>
              <Link href="/shop" className="text-gray-600 hover:text-brand-orange hover:underline transition-colors px-3 py-1 bg-gray-50 rounded-full text-sm">All Products</Link>
              <Link href="/contact" className="text-gray-600 hover:text-brand-orange hover:underline transition-colors px-3 py-1 bg-gray-50 rounded-full text-sm">Contact Support</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
