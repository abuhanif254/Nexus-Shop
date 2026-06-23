"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { triggerHaptic } from "@/utils/haptics";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItemFromCart, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer / Bottom Sheet */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-out flex flex-col
          /* Desktop: Right side drawer */
          md:top-0 md:right-0 md:h-full md:w-[400px] md:max-w-[90vw] md:bottom-auto md:left-auto md:rounded-none
          ${isCartOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
          
          /* Mobile: Bottom Sheet */
          max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full max-md:h-[85vh] max-md:rounded-t-[2rem] max-md:top-auto
          ${isCartOpen ? 'max-md:translate-y-0 max-md:translate-x-0' : 'max-md:translate-y-full max-md:translate-x-0'}
        `}
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-6 pb-4 pt-2 md:pt-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-brand-orange" />
            <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-full transition-all bg-gray-50 md:bg-transparent focus-visible:ring-2 focus-visible:ring-brand-orange outline-none"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative group cursor-pointer hover:bg-orange-100 transition-colors duration-500">
                <div className="absolute inset-0 rounded-full border border-orange-200 scale-110 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
                <ShoppingBag size={40} className="text-brand-orange group-hover:-translate-y-1 transition-transform duration-500" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-8 max-w-[200px]">
                Looks like you haven't added anything yet.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image.startsWith('/') ? item.image : `/${item.image}.jpg`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1 text-sm group-hover:text-brand-orange transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-brand-dark">${item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm min-h-[36px] min-w-[90px]">
                      <button onClick={() => { updateQuantity(item.id, item.quantity - 1); triggerHaptic('light'); }} className="text-gray-500 hover:text-brand-orange min-w-[28px] min-h-[28px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded-full" aria-label="Decrease quantity">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => { updateQuantity(item.id, item.quantity + 1); triggerHaptic('light'); }} className="text-gray-500 hover:text-brand-orange min-w-[28px] min-h-[28px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded-full" aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { removeItemFromCart(item.id); triggerHaptic('medium'); }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2 self-start md:opacity-0 group-hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded-full"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-gray-900">${getCartTotal().toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-brand-orange text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-[0_8px_30px_rgba(249,78,48,0.3)] hover:shadow-[0_8px_30px_rgba(249,78,48,0.5)] hover:-translate-y-1 active:scale-95"
            >
              Checkout Now <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
