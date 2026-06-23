"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center">
        <FadeIn>
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full w-32 h-32 mx-auto animate-pulse"></div>
            <div className="w-32 h-32 bg-red-50 border border-red-100 rounded-full flex items-center justify-center relative z-10">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Something went wrong!
          </h1>
          
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We apologize for the inconvenience. An unexpected error has occurred. Our technical team has been notified and is working to resolve the issue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-brand-orange outline-none"
            >
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-brand-orange outline-none"
            >
              <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          
          {/* Developer Details (only show in dev mode in a real app, but safe for mock) */}
          {process.env.NODE_ENV === 'development' && (
             <div className="mt-12 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left overflow-auto max-h-64">
               <p className="text-red-600 font-bold text-sm mb-2">Error Details (Development Only):</p>
               <pre className="text-xs text-gray-700 whitespace-pre-wrap">{error.message}</pre>
               <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">{error.stack}</pre>
             </div>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
