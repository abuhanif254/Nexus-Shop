"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";

export default function Footer() {
  // State for mobile accordions (by default, all closed on mobile)
  const [openSections, setOpenSections] = useState({
    contact: false,
    quickLinks: false,
    customerService: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-gray-50 dark:bg-[#111111] text-gray-600 dark:text-gray-300 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Company Info (Always visible) */}
          <div>
            <h3 className="text-2xl font-black text-brand-orange tracking-tighter mb-6">NEXUS<span className="text-brand-dark dark:text-white"> SHOP</span></h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              We are a premium e-commerce platform offering the highest quality products with world-class customer service and fast shipping globally. <br /><br />
              <span className="font-semibold text-gray-700 dark:text-gray-200">A proud company of <a href="https://www.shop.nexuscalculator.net" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Sahera Group</a>.</span>
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-colors text-xs font-bold text-gray-600 dark:text-gray-300">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-colors text-xs font-bold text-gray-600 dark:text-gray-300">TW</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-colors text-xs font-bold text-gray-600 dark:text-gray-300">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-colors text-xs font-bold text-gray-600 dark:text-gray-300">YT</a>
            </div>
          </div>

          {/* Contact */}
          <div className="border-b border-gray-200 dark:border-gray-800 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('contact')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-brand-dark dark:text-white font-bold mb-0 md:mb-6 text-lg">Contact Us</h4>
              <ChevronDown size={20} className={`md:hidden transition-transform ${openSections.contact ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm text-gray-500 dark:text-gray-400 mt-6 md:mt-0 overflow-hidden transition-all duration-300 ${openSections.contact ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <span>2300 Kishoreganj Sadar<br />Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-orange shrink-0" />
                <span>+1-800-555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-orange shrink-0" />
                <span>support@shop.nexuscalculator.net</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="border-b border-gray-200 dark:border-gray-800 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-brand-dark dark:text-white font-bold mb-0 md:mb-6 text-lg">Quick Links</h4>
              <ChevronDown size={20} className={`md:hidden transition-transform ${openSections.quickLinks ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 text-sm mt-6 md:mt-0 overflow-hidden transition-all duration-300 ${openSections.quickLinks ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
              <li><Link href="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link href="/shop" className="hover:text-brand-orange transition-colors">Shop</Link></li>
              <li><Link href="/faq" className="hover:text-brand-orange transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-brand-orange transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="border-b border-gray-200 dark:border-gray-800 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('customerService')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-brand-dark dark:text-white font-bold mb-0 md:mb-6 text-lg">Customer Service</h4>
              <ChevronDown size={20} className={`md:hidden transition-transform ${openSections.customerService ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 text-sm mt-6 md:mt-0 overflow-hidden transition-all duration-300 ${openSections.customerService ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
              <li><Link href="/shipping" className="hover:text-brand-orange transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-brand-orange transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/terms" className="hover:text-brand-orange transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link href="/support" className="hover:text-brand-orange transition-colors">Support Center</Link></li>
            </ul>
          </div>

        </div>

        {/* Payment Methods */}
        <div className="pt-8 pb-4 flex flex-col items-center">
          <h4 className="text-brand-dark dark:text-white text-xl mb-6">Payment Methods</h4>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {/* Cash on Delivery */}
            <div className="bg-white px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm w-auto">
              <span className="text-emerald-700 font-black text-[10px] leading-tight text-center">CASH ON<br/>DELIVERY</span>
            </div>
            {/* Visa */}
            <div className="bg-white px-4 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm">
              <span className="text-[#1434CB] font-black text-xl italic tracking-tighter">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="bg-white px-4 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm relative">
              <div className="flex items-center justify-center w-full">
                <div className="w-6 h-6 rounded-full bg-red-500 opacity-90 relative z-10"></div>
                <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 -ml-3 relative z-0 mix-blend-multiply"></div>
              </div>
              <span className="absolute bottom-0.5 text-gray-800 text-[6px] font-bold text-center w-full">mastercard</span>
            </div>
            {/* Amex */}
            <div className="bg-white px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm">
              <div className="bg-[#2671B9] text-white font-bold text-[8px] px-1 py-0.5 rounded-sm leading-tight text-center">AMERICAN<br/>EXPRESS</div>
            </div>
            {/* EMI */}
            <div className="bg-white px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm">
              <span className="text-purple-900 font-bold text-[11px] leading-tight text-center">Easy Monthly<br/>Installments</span>
            </div>
            {/* bKash */}
            <div className="bg-white px-4 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm gap-1">
              <span className="text-[#E2136E] font-bold text-base">bKash</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E2136E" className="-mt-1"><path d="M21 4l-7 7 3 3-5 5-2-2-4 4 1-8 3-3-4-4 7-7 8 2z"/></svg>
            </div>
            {/* Nagad */}
            <div className="bg-white px-4 py-1.5 rounded-md flex items-center justify-center border border-gray-200 shadow-sm gap-1">
              <div className="w-5 h-5 bg-[#ED1C24] rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">ন</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-[#ED1C24] font-bold text-sm">নগদ</span>
              </div>
            </div>
            {/* Nexus */}
            <div className="bg-gray-200 dark:bg-gray-800 px-4 py-1.5 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-700 shadow-sm">
               <span className="text-blue-800 font-black italic text-sm tracking-tighter">Nexus<span className="text-red-600">Pay</span></span>
            </div>
            {/* Rocket */}
            <div className="bg-[#8C3494] px-4 py-1.5 rounded-md flex items-center justify-center shadow-sm gap-1 border border-[#6b2571]">
              <div className="flex flex-col items-center leading-none">
                <span className="text-white font-bold text-sm">রকেট</span>
                <span className="text-white text-[8px] tracking-widest mt-0.5">ROCKET</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Nexus Shop. A Sahera Group Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
