"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "shipping", name: "Shipping & Delivery", icon: Truck },
  { id: "returns", name: "Returns & Refunds", icon: ShieldCheck },
  { id: "account", name: "My Account", icon: MessageCircle },
];

const faqs = [
  {
    id: 1,
    category: "general",
    question: "What is Nexus Shop?",
    answer: "Nexus Shop is a premium e-commerce platform backed by Sahera Group. We offer high-quality products ranging from electronics to home appliances with lightning-fast delivery and world-class customer service."
  },
  {
    id: 2,
    category: "general",
    question: "Are your products genuine?",
    answer: "Absolutely! We source directly from authorized distributors and top brands globally. Every product undergoes strict quality control to guarantee its authenticity."
  },
  {
    id: 3,
    category: "shipping",
    question: "How long does delivery take?",
    answer: "Standard delivery within Dhaka takes 1-2 business days. For orders outside Dhaka, please allow 3-5 business days. We also offer express same-day delivery for eligible locations."
  },
  {
    id: 4,
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Currently, our primary focus is within Bangladesh. However, we are rapidly expanding our global footprint. Please check our shipping page for international availability."
  },
  {
    id: 5,
    category: "returns",
    question: "What is your return policy?",
    answer: "We offer a hassle-free 7-day return policy. If you receive a damaged, defective, or incorrect item, you can return it for a full refund or exchange. The item must be unused and in its original packaging."
  },
  {
    id: 6,
    category: "returns",
    question: "How long do refunds take to process?",
    answer: "Once we receive and inspect your returned item, your refund will be processed automatically within 3-5 business days to your original method of payment (bKash, Nagad, Card, or Store Credit)."
  },
  {
    id: 7,
    category: "account",
    question: "How do I track my order?",
    answer: "You can easily track your order status by logging into your account and visiting the 'Order History' section. You'll also receive email and SMS updates at every stage of the delivery."
  },
  {
    id: 8,
    category: "account",
    question: "Can I change or cancel my order?",
    answer: "Orders can be modified or canceled within 1 hour of placement. Since our fulfillment system is highly automated for fast delivery, please contact our support team immediately if you need to make changes."
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Nexus Shop. Can't find the answer you're looking for? Feel free to contact our support team.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* CATEGORY NAV */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenFaqId(null);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border shadow-sm ${
                activeCategory === cat.id 
                  ? 'bg-brand-orange border-brand-orange text-white shadow-orange-500/20 scale-105' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:bg-orange-50'
              }`}
            >
              <cat.icon size={32} className={`mb-3 ${activeCategory === cat.id ? 'text-white' : 'text-brand-orange'}`} />
              <span className="font-bold text-sm text-center">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ ACCORDION */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 mb-16 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 capitalize flex items-center gap-3">
                {categories.find(c => c.id === activeCategory)?.name} Questions
              </h2>

              {filteredFaqs.length === 0 ? (
                <p className="text-gray-500 italic">No questions found in this category.</p>
              ) : (
                filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? 'border-brand-orange/30 shadow-md bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                    >
                      <span className={`font-bold pr-8 ${openFaqId === faq.id ? 'text-brand-orange' : 'text-gray-900'}`}>
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaqId === faq.id ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {openFaqId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-5 md:px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                            <div className="w-full h-px bg-gray-200 mb-5" />
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CONTACT CTA */}
        <div className="bg-gradient-to-r from-brand-orange to-orange-500 rounded-3xl p-10 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
              <PhoneCall size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Our dedicated customer support team is available 24/7 to help you with anything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-brand-orange hover:bg-gray-50 font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
