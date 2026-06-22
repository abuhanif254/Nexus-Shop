"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

export default function MobileFilterWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold shadow-sm mb-6 hover:border-brand-orange hover:text-brand-orange transition-colors"
      >
        <Filter size={18} />
        Show Filters
      </button>

      {/* Desktop Wrapper (Always visible on lg) */}
      <div className="hidden lg:block w-full">
        {children}
      </div>

      {/* Mobile Off-Canvas Drawer (Visible when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-gray-50 shadow-2xl h-full animate-in slide-in-from-left">
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
              <span className="font-bold text-lg text-brand-dark flex items-center gap-2">
                <Filter size={20} />
                Filters
              </span>
              <button 
                className="p-2 text-gray-500 hover:text-brand-orange transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              {children}
            </div>
            
            {/* Apply Button */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100 mt-auto">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
