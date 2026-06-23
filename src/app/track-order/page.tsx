"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Package, Truck, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";

const steps = [
  { id: "PENDING", name: "Order Placed", icon: Package },
  { id: "PROCESSING", name: "Processing", icon: RefreshCw },
  { id: "SHIPPED", name: "Shipped", icon: Truck },
  { id: "DELIVERED", name: "Delivered", icon: CheckCircle2 }
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrderData(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to track order");
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError("An error occurred while tracking the order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    const index = steps.findIndex(s => s.id === status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Truck size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-300">
            Enter your order ID and email address below to see the real-time status of your delivery.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        
        {/* TRACKING FORM */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-12 relative overflow-hidden">
          <form onSubmit={handleTrack} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5 space-y-2">
              <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700">Order ID</label>
              <input 
                type="text" 
                id="orderId" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white"
                placeholder="e.g. 5f8d4a..."
              />
            </div>
            <div className="md:col-span-5 space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Billing Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white"
                placeholder="john@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center h-[50px] shadow-premium hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TRACKING RESULTS */}
        <AnimatePresence>
          {orderData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-100 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Order #{orderData.order.id.slice(0, 8).toUpperCase()}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(orderData.order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-brand-dark text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm">
                  ${orderData.order.totalAmount.toFixed(2)}
                </div>
              </div>

              {orderData.order.status === "CANCELLED" ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-red-500" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This order has been cancelled. If you believe this is an error or if you have questions, please contact our support team.
                  </p>
                </div>
              ) : (
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row justify-between mb-16 relative">
                    {/* Background Progress Bar */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="hidden md:block absolute top-1/2 left-0 h-1.5 bg-brand-orange -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(getStepIndex(orderData.order.status) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                      const isActive = getStepIndex(orderData.order.status) >= index;
                      const isCurrent = getStepIndex(orderData.order.status) === index;
                      
                      return (
                        <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 mb-8 md:mb-0">
                          {/* Vertical mobile line */}
                          {index !== steps.length - 1 && (
                            <div className={`md:hidden absolute left-6 top-12 bottom-[-40px] w-1 ${isActive ? 'bg-brand-orange' : 'bg-gray-100'}`} />
                          )}
                          
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors duration-500 ${
                              isActive 
                                ? 'bg-brand-orange border-orange-100 text-white shadow-lg shadow-orange-500/30' 
                                : 'bg-white border-gray-100 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-brand-orange/20 ring-offset-2' : ''}`}
                          >
                            <step.icon size={20} />
                          </motion.div>
                          
                          <div className="md:text-center pt-1 md:pt-0">
                            <p className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.name}
                            </p>
                            {isCurrent && (
                              <span className="text-xs font-semibold text-brand-orange block mt-1">Current Status</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SHIPPING INFO */}
                  <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <MapPin className="text-brand-orange" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Delivery Address</h4>
                      <p className="text-gray-600 text-sm">{orderData.shipping.fullName}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {orderData.shipping.city}, {orderData.shipping.country}
                      </p>
                      <p className="text-xs font-bold text-brand-orange mt-3 flex items-center gap-1">
                        <Clock size={12} /> Expected Delivery by {new Date(orderData.order.expectedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
