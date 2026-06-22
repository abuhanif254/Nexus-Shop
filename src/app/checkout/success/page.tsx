"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear the cart when they reach the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen py-24 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-12 shadow-xl max-w-lg w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with Besa. Your order has been securely received and is now being processed.
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Reference</p>
          <p className="text-sm font-mono text-gray-900">{orderId || "N/A"}</p>
        </div>

        <Link href="/" className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
