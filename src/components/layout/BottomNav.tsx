"use client";

import Link from 'next/link';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const { getCartCount, setIsCartOpen } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass dark:glass-darker border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-none z-50 px-6 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between">
      <Link href="/" className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] ${pathname === '/' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors'}`}>
        <Home size={22} />
        <span className="text-[10px] font-semibold">Home</span>
      </Link>
      
      <Link href="/categories" className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] ${pathname === '/categories' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors'}`}>
        <LayoutGrid size={22} />
        <span className="text-[10px] font-semibold">Categories</span>
      </Link>
      
      <button onClick={() => setIsCartOpen(true)} className={`relative flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] ${pathname === '/cart' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors'}`}>
        <div className="relative">
          <ShoppingCart size={22} />
          {mounted && getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full text-brand-dark">
              {getCartCount()}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold">Cart</span>
      </button>
      
      <Link href="/account" className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] ${pathname === '/account' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors'}`}>
        <User size={22} />
        <span className="text-[10px] font-semibold">Account</span>
      </Link>
    </div>
  );
}
