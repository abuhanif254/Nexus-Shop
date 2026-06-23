import { RefreshCcw, ShieldAlert, CheckCircle2, Box, CreditCard, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Exchanges | Nexus Shop",
  description: "Learn about Nexus Shop's hassle-free return and exchange policy. Enjoy a 30-day return window and easy refunds on all your premium purchases.",
  keywords: "returns, exchanges, refund policy, Nexus Shop returns, return policy, hassle-free returns",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607528973315-77983679f225?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <RefreshCcw size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We want you to love what you ordered. If you don't, we've made the return and exchange process as simple and hassle-free as possible.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* KEY HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">30-Day Window</h3>
            <p className="text-gray-600 text-sm">Return or exchange any unworn, unwashed, or defective merchandise within 30 days of delivery.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Box className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Process</h3>
            <p className="text-gray-600 text-sm">Package your items securely and use our pre-paid shipping label to send them back to us.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Refunds</h3>
            <p className="text-gray-600 text-sm">Refunds are processed within 5-7 business days of receiving the returned items at our warehouse.</p>
          </div>
        </div>

        {/* POLICY CONTENT */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 prose prose-lg prose-orange max-w-none text-gray-600">
          
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mt-0">
            Conditions for Returns
          </h2>
          <p>
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
          </p>
          <ul>
            <li>Items must be returned within <strong>30 days</strong> of the delivery date.</li>
            <li>Original tags must remain attached.</li>
            <li>Items must be free from stains, odors, or any signs of use.</li>
            <li>Footwear must be returned in the original shoebox without any postage labels placed directly on the box.</li>
          </ul>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-gray-700 not-prose mb-10 flex gap-4 items-start">
            <ShieldAlert className="text-brand-orange shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Non-Returnable Items</h4>
              <p className="text-sm">
                Certain types of items cannot be returned due to hygiene and safety reasons. These include: intimate apparel, swimwear (if the hygiene strip is removed), gift cards, personalized or custom-made items, and final sale items marked with "No Return".
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900">How to Start a Return or Exchange</h2>
          <p>
            Starting a return or exchange is incredibly easy. Just follow these simple steps:
          </p>
          <ol>
            <li><strong>Contact Us:</strong> Email our support team at <a href="mailto:support@nexusshop.com" className="text-brand-orange font-bold hover:underline">support@nexusshop.com</a> with your order number and the reason for the return.</li>
            <li><strong>Receive Label:</strong> We will review your request and send you a pre-paid return shipping label along with instructions.</li>
            <li><strong>Pack the Items:</strong> Securely pack the items in their original packaging and attach the pre-paid label to the outside of the box.</li>
            <li><strong>Drop Off:</strong> Drop the package off at your nearest designated courier location.</li>
          </ol>

          <h2 className="text-2xl font-black text-gray-900 mt-12">Refunds</h2>
          <p>
            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within <strong>5-7 business days</strong>. 
          </p>
          <p>
            Please remember it can take some time for your bank or credit card company to process and post the refund to your account. If more than 15 business days have passed since we’ve approved your return, please <Link href="/contact" className="text-brand-orange font-bold hover:underline">contact us</Link>.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">Exchanges</h2>
          <p>
            The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. If you need a direct exchange for a different size or color, please mention this when emailing our support team, and we will try our best to accommodate your request depending on inventory availability.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">International Returns</h2>
          <p>
            For international orders, please note that we do not currently offer free pre-paid return labels. International customers are responsible for the return shipping costs. Please clearly mark the package as a "Return" to avoid any customs duties on the incoming package.
          </p>
        </div>

        {/* CTA SECTION */}
        <div className="mt-16 bg-brand-dark rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Still have questions?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our customer support team is available 24/7 to help you with any questions regarding your return or exchange.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              <Mail size={20} />
              Contact Support
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Last updated: June 2026. This Return & Exchange Policy is subject to change without prior notice.
        </p>

      </div>
    </div>
  );
}
