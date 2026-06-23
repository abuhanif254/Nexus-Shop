"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Banknote, MapPin, Truck, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getCartTotal } = useCartStore();
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState<string>("CARD");

  const { register, handleSubmit, formState: { errors }, trigger, getValues, reset } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched"
  });

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: data,
          paymentMethod,
          subtotal: getCartTotal(),
          tax: getCartTotal() * 0.08,
          shipping: getCartTotal() > 50 ? 0 : 15,
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const result = await response.json();
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        router.push(`/checkout/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was a problem processing your order. Please try again.');
    }
  };

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/cart');
    }

    fetch('/api/account/addresses')
      .then(res => res.json())
      .then(data => {
        if (data.addresses && data.addresses.length > 0) {
          const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          reset({
            fullName: defaultAddr.fullName,
            email: data.userEmail || "",
            phone: defaultAddr.phone,
            addressLine1: defaultAddr.addressLine1,
            city: defaultAddr.city,
            postalCode: defaultAddr.postalCode,
          });
        }
      })
      .catch(err => console.error("Could not load default address", err))
      .finally(() => setLoadingAddress(false));

  }, [items, router, reset]);

  if (!mounted || items.length === 0) return null;

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 15;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen py-8 md:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-brand-orange dark:hover:text-brand-orange transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs md:text-sm font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/50 shadow-sm">
            <ShieldCheck size={16} /> SSL Secured
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 hidden md:block">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
             {/* Background Line */}
             <div className="absolute left-0 top-4 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
             {/* Active Line */}
             <div className="absolute left-0 top-4 h-1 bg-brand-orange -z-10 rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
             
             {/* Step 0: Cart */}
             <div className="flex flex-col items-center gap-2">
               <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(249,78,48,0.4)]">
                 <Check size={18} strokeWidth={3} />
               </div>
               <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mt-1">Cart</span>
             </div>
             
             {/* Step 1: Shipping */}
             <div className="flex flex-col items-center gap-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= 1 ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(249,78,48,0.4)] scale-110' : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                 {step > 1 ? <Check size={18} strokeWidth={3} /> : '1'}
               </div>
               <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Shipping</span>
             </div>
             
             {/* Step 2: Payment */}
             <div className="flex flex-col items-center gap-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= 2 ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(249,78,48,0.4)] scale-110' : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                 2
               </div>
               <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Payment</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Form Steps */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Step 1: Shipping */}
            <div className={`bg-white dark:bg-[#151515] rounded-3xl border ${step === 1 ? 'border-brand-orange shadow-2xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-brand-orange/20' : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'} p-6 md:p-8 transition-all duration-500`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-brand-orange/10 text-brand-orange' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>1</div>
                <h2 className={`text-2xl font-black tracking-tight ${step === 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Shipping Information</h2>
              </div>
              
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Full Name</label>
                    <input {...register("fullName")} type="text" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.fullName ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="John Doe" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
                    <input {...register("email")} type="email" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.email ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Phone Number</label>
                    <input {...register("phone")} type="tel" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.phone ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="+1 (555) 000-0000" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Address Line 1</label>
                    <input {...register("addressLine1")} type="text" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.addressLine1 ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="123 Commerce St" />
                    {errors.addressLine1 && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.addressLine1.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">City</label>
                    <input {...register("city")} type="text" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.city ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="New York" />
                    {errors.city && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Postal Code</label>
                    <input {...register("postalCode")} type="text" className={`w-full bg-gray-50 dark:bg-[#111111] border ${errors.postalCode ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800 focus:border-brand-orange focus:ring-brand-orange'} rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white`} placeholder="10001" />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.postalCode.message}</p>}
                  </div>
                  
                  <div className="md:col-span-2 mt-6">
                    <button onClick={handleNextStep} disabled={loadingAddress} className="w-full bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] disabled:opacity-50">
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="flex items-center justify-between pl-14">
                  <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold text-gray-900 dark:text-white text-base">{getValues("fullName")}</span>
                    <span className="flex items-center gap-1.5 mt-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 w-fit"><MapPin size={14} className="text-brand-orange" /> {getValues("addressLine1")}, {getValues("city")}, {getValues("postalCode")}</span>
                  </div>
                  <button onClick={() => setStep(1)} className="text-sm font-bold text-brand-orange hover:text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-4 py-2 rounded-lg transition-colors">Edit</button>
                </div>
              )}
            </div>
            
            {/* Step 2: Payment */}
            <div className={`bg-white dark:bg-[#151515] rounded-3xl border ${step === 2 ? 'border-brand-orange shadow-2xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-brand-orange/20' : 'border-gray-200 dark:border-gray-800 opacity-60'} p-6 md:p-8 transition-all duration-500`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-brand-orange/10 text-brand-orange' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>2</div>
                <h2 className={`text-2xl font-black tracking-tight ${step === 2 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                  
                  {/* Credit Card */}
                  <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-brand-orange bg-orange-50/50 dark:bg-orange-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-[#111111]'}`}>
                    <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-orange focus:ring-brand-orange bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
                    <div className="ml-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'CARD' ? 'bg-white dark:bg-gray-900 shadow-sm' : 'bg-transparent'}`}>
                        <CreditCard size={24} className={paymentMethod === 'CARD' ? 'text-brand-orange' : 'text-gray-400'} />
                      </div>
                      <div>
                        <p className={`font-bold ${paymentMethod === 'CARD' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Credit or Debit Card</p>
                        <p className="text-xs text-gray-500 mt-0.5">Processed securely by Stripe</p>
                      </div>
                    </div>
                  </label>

                  {/* SSLCommerz */}
                  <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'SSLCOMMERZ' ? 'border-[#008940] bg-green-50/50 dark:bg-green-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-[#111111]'}`}>
                    <input type="radio" name="payment" value="SSLCOMMERZ" checked={paymentMethod === 'SSLCOMMERZ'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#008940] focus:ring-[#008940] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
                    <div className="ml-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'SSLCOMMERZ' ? 'bg-white dark:bg-gray-900 shadow-sm' : 'bg-transparent'}`}>
                        <div className="w-8 h-8 bg-[#008940] rounded flex items-center justify-center text-white font-black text-[10px] tracking-tighter text-center leading-none">SSL</div>
                      </div>
                      <div>
                        <p className={`font-bold ${paymentMethod === 'SSLCOMMERZ' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>bKash, Nagad, BD Cards</p>
                        <p className="text-xs text-gray-500 mt-0.5">Secure payment via SSLCommerz</p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-[#111111]'}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
                    <div className="ml-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-white dark:bg-gray-900 shadow-sm' : 'bg-transparent'}`}>
                        <Banknote size={24} className={paymentMethod === 'COD' ? 'text-emerald-500' : 'text-gray-400'} />
                      </div>
                      <div>
                        <p className={`font-bold ${paymentMethod === 'COD' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Cash on Delivery</p>
                        <p className="text-xs text-gray-500 mt-0.5">Pay securely when your package arrives</p>
                      </div>
                    </div>
                  </label>

                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-[#151515] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] sticky top-32">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Order Summary</h3>
              
              {/* Items Preview */}
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {item.image && item.image.startsWith('/') ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400">Img</span>
                      )}
                      <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md z-10">{item.quantity}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">{item.title}</p>
                      <p className="text-brand-orange font-bold text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-[#111111] rounded-2xl p-5 mb-6 space-y-3 text-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-bold text-brand-orange">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-[10px] text-gray-500 text-right mt-1">Free shipping over $50</div>
                )}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total to Pay</span>
                <span className="text-3xl font-black text-brand-dark dark:text-white tracking-tight">${total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleSubmit(onSubmit)}
                disabled={step === 1}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-lg ${step === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none' : 'bg-brand-orange text-white hover:bg-orange-600 shadow-[0_10px_40px_rgba(249,78,48,0.3)] active:scale-95'}`}
              >
                Place Order Now
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck size={16} className="text-green-500" />
                Payments are securely encrypted.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
