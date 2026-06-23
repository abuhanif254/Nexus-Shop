import { Shield, Lock, Eye, Database, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Nexus Shop",
  description: "Learn how Nexus Shop collects, uses, and protects your personal data. Read our comprehensive Privacy Policy to understand your rights.",
  keywords: "privacy policy, data protection, security, personal information, Nexus Shop privacy, GDPR",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510511459019-5efa7ae5ca6c?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Shield size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your privacy is critically important to us. We are committed to protecting your personal data and being completely transparent about how we use it.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* PRIVACY PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Data</h3>
            <p className="text-gray-600 text-sm">We use enterprise-grade encryption to ensure your personal and payment data is kept perfectly safe.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency</h3>
            <p className="text-gray-600 text-sm">We don't hide anything in the fine print. We clearly state exactly what data we collect and why.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="text-brand-orange" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">You Are In Control</h3>
            <p className="text-gray-600 text-sm">You own your data. You have the right to request access to, edit, or permanently delete your data.</p>
          </div>
        </div>

        {/* POLICY CONTENT */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 prose prose-lg prose-orange max-w-none text-gray-600">
          
          <h2 className="text-2xl font-black text-gray-900 mt-0">1. Information We Collect</h2>
          <p>
            When you visit Nexus Shop, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. 
          </p>
          <p>
            Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as "Order Information".
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">2. How We Use Your Information</h2>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). 
          </p>
          <p>Additionally, we use this Order Information to:</p>
          <ul>
            <li>Communicate with you regarding your order or our services</li>
            <li>Screen our orders for potential risk or fraud</li>
            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mt-12">3. Sharing Your Personal Information</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Stripe to power our secure payment processing. We also use Google Analytics to help us understand how our customers use the Site.
          </p>
          <p>
            Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
          </p>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-gray-700 not-prose my-10">
            <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-brand-orange" size={20} /> We never sell your data
            </h4>
            <p className="text-sm">
              We want to be perfectly clear: Nexus Shop has never and will never sell your personal data to third-party data brokers or advertising networks. Your trust is our most valuable asset.
            </p>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mt-12">4. Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. This is necessary for us to fulfill our legal obligations regarding tax and accounting records.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">5. Your Rights</h2>
          <p>
            If you are a resident of the European Economic Area (EEA) or California, you have certain data protection rights. You have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </p>
          <p>
            Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">6. Cookies</h2>
          <p>
            We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified.
          </p>

        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Last updated: June 2026. If you have questions or require more information about our Privacy Policy, do not hesitate to <Link href="/contact" className="text-brand-orange font-bold hover:underline">contact us</Link>.
        </p>

      </div>
    </div>
  );
}
