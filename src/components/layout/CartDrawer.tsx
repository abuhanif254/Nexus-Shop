"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Sparkles, PauseCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { triggerHaptic } from "@/utils/haptics";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItemFromCart, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [ordersEnabled, setOrdersEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Fetch the store mode flag — fail safe defaults to true
    fetch('/api/store-settings')
      .then(r => r.json())
      .then(d => setOrdersEnabled(d.ordersEnabled !== false))
      .catch(() => setOrdersEnabled(true));
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div 
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] max-w-[100vw] bg-white dark:bg-[#111111] shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="bg-brand-orange/10 p-2 rounded-xl text-brand-orange">
                  <ShoppingBag size={24} />
                </div>
                <h2 className="text-xl font-black text-brand-dark dark:text-white tracking-tight">Your Cart</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 rounded-full transition-all bg-gray-50 dark:bg-gray-800 sm:bg-transparent focus-visible:ring-2 focus-visible:ring-brand-orange outline-none"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-8 relative group cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700"
                  >
                    <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 group-hover:-translate-y-2 group-hover:text-brand-orange transition-all duration-300" />
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded-lg rotate-12 shadow-sm uppercase"
                    >
                      Empty
                    </motion.div>
                  </motion.div>
                  <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">Your cart is empty</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-8 max-w-[240px]">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-premium hover:shadow-premium-hover active:scale-95 text-lg w-full max-w-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="flex gap-4 p-3 bg-white dark:bg-[#151515] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 hover:border-brand-orange/30 transition-all group"
                  >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden shrink-0 relative">
                      <img src={item.image.startsWith('/') ? item.image : `/${item.image}.jpg`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-0.5">{item.brand}</p>
                          <h4 className="font-bold text-brand-dark dark:text-white line-clamp-2 text-sm leading-snug">{item.title}</h4>
                        </div>
                        <button 
                          onClick={() => { removeItemFromCart(item.id); triggerHaptic('medium'); }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-3">
                        <span className="font-black text-brand-dark dark:text-white text-lg">${item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-full px-1.5 py-1 border border-gray-100 dark:border-gray-800">
                          <button onClick={() => { updateQuantity(item.id, item.quantity - 1); triggerHaptic('light'); }} className="text-gray-500 hover:text-brand-orange w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 font-bold" aria-label="Decrease quantity">-</button>
                          <span className="text-xs font-bold w-4 text-center text-brand-dark dark:text-white">{item.quantity}</span>
                          <button onClick={() => { updateQuantity(item.id, item.quantity + 1); triggerHaptic('light'); }} className="text-gray-500 hover:text-brand-orange w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 font-bold" aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#111111]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="font-bold text-brand-dark dark:text-white">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="font-bold text-brand-dark dark:text-white">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-base font-bold text-brand-dark dark:text-white">Total</span>
                    <span className="text-2xl font-black text-brand-orange">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                {ordersEnabled ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-premium hover:shadow-premium-hover active:scale-95 text-lg"
                  >
                    Checkout Now <ArrowRight size={20} />
                  </Link>
                ) : (
                  /* ── AFFILIATE MODE BANNER (shown when orders are paused) ── */
                  <div className="rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                    {/* Paused notice */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
                      <PauseCircle size={14} className="text-amber-600 shrink-0" />
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Orders Temporarily Paused</p>
                    </div>
                    {/* Message */}
                    <div className="p-4 text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-1 leading-snug">
                        We&apos;re not processing orders right now — but we&apos;ve found <span className="text-brand-orange font-black">amazing deals</span> for you!
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Explore our curated affiliate picks and save big.
                      </p>
                      <Link
                        href="/blog"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200"
                      >
                        <Sparkles size={16} />
                        Explore Affiliate Deals
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
