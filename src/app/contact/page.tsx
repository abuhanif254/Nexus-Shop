"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? We'd love to hear from you. Our team is always here to help.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* CONTACT INFO */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Reach out to us through any of the channels below. We aim to respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-orange" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
                  <p className="text-gray-600 text-sm">2300 Kishoreganj Sadar,<br />Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="text-brand-orange" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-600 text-sm">(+880) 1234-567890</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Fri from 9am to 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-brand-orange" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-gray-600 text-sm">support@nexusshop.com</p>
                  <p className="text-gray-500 text-xs mt-1">Online support</p>
                </div>
              </div>
            </div>

            {/* Social Media Links Using SVGs */}
            <div className="pt-8">
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-gray-100">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-gray-100">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-gray-100">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-gray-100">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 relative z-10">Send us a Message</h2>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600">Thank you for reaching out. We will get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">Subject</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="sales">Sales & Partnerships</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Your Message</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors outline-none bg-gray-50 focus:bg-white resize-none"
                      placeholder="How can we help you today?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-brand-dark hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message 
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116347.05051936303!2d90.71887268800363!3d24.43312061245084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37569188eb215161%3A0xc6c761dfcc43026e!2sKishoreganj!5e0!3m2!1sen!2sbd!4v1716654212957!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
