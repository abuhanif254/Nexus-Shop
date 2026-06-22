import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
        
        {/* Inner static icon / logo */}
        <div className="w-16 h-16 bg-white dark:bg-brand-dark rounded-full shadow-lg flex items-center justify-center relative z-10 m-2">
          <span className="text-2xl font-black tracking-tighter text-gray-800 dark:text-gray-200">
            B<span className="text-brand-orange">.</span>
          </span>
        </div>
      </div>
      <p className="mt-6 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}
