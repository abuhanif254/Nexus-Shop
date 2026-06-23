import { Truck, Globe, Clock, ShieldCheck, MapPin, Package } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Nexus Shop",
  description: "Read our comprehensive shipping policy. We offer fast, reliable domestic and international shipping with complete tracking and secure packaging.",
  keywords: "shipping policy, delivery, international shipping, Nexus Shop delivery, order tracking",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7451296?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Truck size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Shipping Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Fast, reliable, and fully trackable delivery. Here is everything you need to know about how we get your favorite products to your doorstep.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* HIGHLIGHT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Dispatch</h3>
            <p className="text-gray-600 text-sm">Orders are processed and dispatched within 24 hours of confirmation.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-gray-600 text-sm">We partner with top-tier logistics to deliver anywhere in the world.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Transit</h3>
            <p className="text-gray-600 text-sm">Every package is securely sealed and fully insured during transit.</p>
          </div>
        </div>

        {/* POLICY CONTENT */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 prose prose-lg prose-orange max-w-none text-gray-600">
          
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mt-0">
            <Package className="text-brand-orange" /> Order Processing Times
          </h2>
          <p>
            At Nexus Shop, we know you want your items as quickly as possible. All orders are processed within <strong>1 to 2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. 
          </p>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-gray-700 not-prose mb-8">
            <strong>Note:</strong> During high-volume periods (like Black Friday or Eid sales), processing times may be slightly extended. We appreciate your patience during these times.
          </div>

          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <MapPin className="text-brand-orange" /> Domestic Shipping Rates & Estimates
          </h2>
          <p>
            For domestic orders within Bangladesh, shipping charges for your order will be calculated and displayed at checkout. We offer the following standard tiers:
          </p>
          <div className="overflow-x-auto not-prose mb-8">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="p-4 font-bold text-gray-900">Shipping Option</th>
                  <th className="p-4 font-bold text-gray-900">Estimated Delivery Time</th>
                  <th className="p-4 font-bold text-gray-900">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">Inside Dhaka (Standard)</td>
                  <td className="p-4">1 to 2 business days</td>
                  <td className="p-4 font-bold">৳ 60</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">Inside Dhaka (Same Day)</td>
                  <td className="p-4">Delivered by 8:00 PM today</td>
                  <td className="p-4 font-bold">৳ 120</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">Outside Dhaka (Standard)</td>
                  <td className="p-4">3 to 5 business days</td>
                  <td className="p-4 font-bold">৳ 120</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Globe className="text-brand-orange" /> International Shipping
          </h2>
          <p>
            We offer international shipping to over 50 countries. Shipping charges for international orders are calculated dynamically at checkout based on the destination and the dimensional weight of the package.
          </p>
          <p>
            Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Nexus Shop is not responsible for these charges if they are applied and are your responsibility as the customer.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">How do I check the status of my order?</h2>
          <p>
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available. 
          </p>
          <p>
            You can also track your order directly on our website by visiting our <a href="/track-order" className="text-brand-orange font-bold hover:underline">Track Order page</a> and entering your Order ID and billing email.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">P.O. Boxes & APO/FPO Addresses</h2>
          <p>
            Currently, our courier partners are unable to deliver to P.O. Boxes or military APO/FPO addresses. Please ensure you provide a valid residential or commercial street address during checkout to avoid delivery delays.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">Lost, Missing, or Damaged Packages</h2>
          <p>
            In the event that your order arrives damaged in any way, please email us as soon as possible at <strong>support@nexusshop.com</strong> with your order number and a photo of the item’s condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
          </p>
          <p>
            If your package is marked as delivered but you cannot find it, please check with neighbors or your building manager first. If it is still missing after 48 hours from the delivery notification, contact our support team immediately.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Last updated: June 2026. This Shipping Policy is subject to change without prior notice.
        </p>

      </div>
    </div>
  );
}
