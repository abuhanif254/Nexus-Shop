"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-0 left-0 md:left-auto md:right-6 z-[100] flex flex-col items-center md:items-end gap-2 px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-w-[300px] max-w-sm animate-in slide-in-from-bottom-5 md:slide-in-from-right-8 fade-in duration-300"
        >
          {toast.type === 'success' && <CheckCircle2 className="text-green-500 shrink-0" size={20} />}
          {toast.type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={20} />}
          {toast.type === 'info' && <Info className="text-blue-500 shrink-0" size={20} />}
          
          <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
