import { Scale, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Nexus Shop",
  description: "Read the Terms and Conditions for using Nexus Shop. Learn about our service guidelines, user responsibilities, and intellectual property policies.",
  keywords: "terms and conditions, terms of service, user agreement, Nexus Shop terms",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Scale size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our service. They outline the rules and regulations for the use of Nexus Shop's Website.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        {/* QUICK SUMMARY ALERTS */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="flex gap-4 items-start mb-6 pb-6 border-b border-gray-100">
            <FileText className="text-brand-orange shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Agreement to Terms</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                By accessing this website, we assume you accept these terms and conditions. Do not continue to use Nexus Shop if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <ShieldAlert className="text-brand-orange shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Age Restriction</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site.
              </p>
            </div>
          </div>
        </div>

        {/* POLICY CONTENT */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 prose prose-lg prose-orange max-w-none text-gray-600">
          
          <h2 className="text-2xl font-black text-gray-900 mt-0">1. Intellectual Property Rights</h2>
          <p>
            Other than the content you own, under these Terms, Nexus Shop and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Nexus Shop</li>
            <li>Sell, rent or sub-license material from Nexus Shop</li>
            <li>Reproduce, duplicate or copy material from Nexus Shop</li>
            <li>Redistribute content from Nexus Shop</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mt-12">2. User Accounts & Registration</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">3. Products or Services</h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
          </p>
          <p>
            We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to limit the sales of our products or Services to any person, geographic region or jurisdiction.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">4. Accuracy of Billing and Account Information</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
          </p>
          <p>
            In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">5. Third-Party Links</h2>
          <p>
            Certain content, products, and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">6. Limitation of Liability</h2>
          <p>
            In no event shall Nexus Shop, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Nexus Shop, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-12">7. Changes to Terms of Service</h2>
          <p>
            You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
          </p>

        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Last updated: June 2026. If you have any questions about these Terms, please contact us at support@nexusshop.com.
        </p>

      </div>
    </div>
  );
}
