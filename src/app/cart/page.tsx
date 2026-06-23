"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItemFromCart, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // Mock 8% tax
  const shipping = subtotal > 50 ? 0 : 15; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Your Shopping Cart</h1>
          <p className="text-gray-500 text-sm">
            {items.length === 0 ? "Your cart is currently empty." : `You have ${items.length} item(s) in your cart.`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/40 max-w-2xl mx-auto animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-8 relative group cursor-pointer hover:bg-orange-100 transition-colors duration-500">
              <div className="absolute inset-0 rounded-full border border-orange-200 scale-110 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700"></div>
              <ShoppingBag size={56} className="text-brand-orange group-hover:-translate-y-2 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
              Looks like you haven't added anything to your cart yet. Browse our top categories and find something you love!
            </p>
            <Link href="/" className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-[0_8px_30px_rgba(249,78,48,0.3)] hover:shadow-[0_8px_30px_rgba(249,78,48,0.5)] hover:-translate-y-1 active:scale-95 text-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 border-b border-gray-100 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:items-center relative group">
                      
                      {/* Product Details */}
                      <div className="col-span-1 md:col-span-6 flex gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-lg shrink-0 flex items-center justify-center border border-gray-100">
                           <span className="text-[10px] text-gray-400">Img</span>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1">{item.brand}</p>
                          <Link href={`/product/${item.title.toLowerCase().replace(/ /g, '-')}`} className="text-sm md:text-base font-bold text-gray-800 hover:text-brand-orange transition-colors line-clamp-2 leading-tight mb-2">
                            {item.title}
                          </Link>
                          {/* Mobile Price & Remove (Hidden on Desktop) */}
                          <div className="flex items-center justify-between md:hidden mt-auto">
                            <span className="font-bold text-brand-dark">${item.price.toFixed(2)}</span>
                            <button onClick={() => removeItemFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Price */}
                      <div className="hidden md:block col-span-2 text-center font-bold text-gray-600">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-center mt-2 md:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-full h-10 bg-white">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-brand-orange transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-brand-orange transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Desktop Total & Remove */}
                      <div className="hidden md:flex col-span-2 items-center justify-end gap-4">
                        <span className="font-bold text-brand-dark">${(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeItemFromCart(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-brand-orange">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-brand-dark">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">Including VAT</p>
                </div>

                <Link href="/checkout" className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group">
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Express Checkout Options */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                  <p className="text-xs text-center text-gray-500 font-semibold mb-1 uppercase tracking-wider">Express Checkout</p>
                  <button className="w-full bg-black dark:bg-white dark:text-black text-white h-12 rounded-xl flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    <span className="font-semibold tracking-tighter text-lg"> Pay</span>
                  </button>
                  <button className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white h-12 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#222] transition-colors shadow-sm">
                    <span className="font-bold tracking-tighter text-lg"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span> Pay</span>
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                  <ShieldCheck size={16} className="text-green-500" />
                  Secure Encrypted Checkout
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
