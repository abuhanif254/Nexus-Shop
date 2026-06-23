"use client";

import Link from 'next/link';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { triggerHaptic } from '@/utils/haptics';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Categories', href: '/categories', icon: LayoutGrid },
  { name: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const { getCartCount, setIsCartOpen } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass dark:glass-darker border-t border-gray-100 dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-50 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return item.isCart ? (
          <button
            key={item.name}
            onClick={() => { setIsCartOpen(true); triggerHaptic('medium'); }}
            className="relative flex flex-col items-center justify-center gap-1 w-[72px] h-[52px] outline-none rounded-xl group z-10"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute inset-0 bg-brand-orange-light dark:bg-brand-dark rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <div className="relative">
              <Icon size={22} className={`${isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-orange'} transition-colors`} />
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-orange text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full text-white shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 font-semibold'}`}>{item.name}</span>
          </button>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => triggerHaptic('light')}
            className="relative flex flex-col items-center justify-center gap-1 w-[72px] h-[52px] outline-none rounded-xl group z-10"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute inset-0 bg-brand-orange-light dark:bg-brand-dark rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Icon size={22} className={`${isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-orange'} transition-colors`} />
            <span className={`text-[10px] font-bold ${isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 font-semibold'}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
