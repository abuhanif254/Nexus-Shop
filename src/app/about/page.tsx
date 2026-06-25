import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Globe, ArrowRight, Award, Users, MapPin } from "lucide-react";

const SITE_URL = 'https://www.shop.nexuscalculator.net';

export const metadata = {
  title: "About Us | Nexus Shop by Sahera Group",
  description: "Learn about Nexus Shop, a proud company of Sahera Group. Discover our mission, editorial standards, and commitment to premium e-commerce in Bangladesh and beyond.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Nexus Shop | Sahera Group",
    description: "Nexus Shop editorial mission, team, and values.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

// Organization + AboutPage JSON-LD — major E-E-A-T signal for Google News
const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Nexus Shop",
      alternateName: "The Nexus Journal",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      foundingDate: "2024",
      description: "Nexus Shop is a premium affiliate marketing and e-commerce platform, operated by Sahera Group, headquartered in Kishoreganj, Bangladesh.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2300 Kishoreganj Sadar",
        addressLocality: "Kishoreganj",
        addressRegion: "Dhaka",
        addressCountry: "BD",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@shop.nexuscalculator.net",
        availableLanguage: ["English"],
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Sahera Group",
        url: SITE_URL,
      },
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about`,
      url: `${SITE_URL}/about`,
      name: "About Nexus Shop",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      about: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Organization + AboutPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gray-50 pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
            alt="Modern Office"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/90" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-orange font-bold tracking-wider uppercase mb-4 text-sm sm:text-base">
            A Proud Company of Sahera Group
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Elevating E-Commerce <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">
              Beyond Boundaries.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Nexus Shop was founded on a simple premise: to provide a world-class shopping experience with uncompromising quality, fast delivery, and absolute trust.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY & HERITAGE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1932&auto=format&fit=crop"
                alt="Our Heritage"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-orange/10 mix-blend-multiply" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Our Heritage & Vision</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                As a flagship venture of <strong className="text-gray-900">Sahera Group</strong>, Nexus Shop inherits a legacy of excellence, integrity, and innovation. We are headquartered in the heart of Bangladesh, yet our vision is decidedly global.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to curate the finest products from around the world and deliver them directly to your doorstep. We believe that shopping online should be a seamless, secure, and delightful experience from the moment you land on our site to the moment you unbox your order.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Premium Standards</h4>
                  <p className="text-gray-500">Committed to absolute quality control.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES / WHY CHOOSE US */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">The Nexus Advantage</h2>
            <p className="text-lg text-gray-600">
              We don't just sell products; we deliver promises. Here is why thousands of customers choose Nexus Shop every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Bank-level encryption ensures your data and payments are always protected." },
              { icon: Truck, title: "Lightning Fast Delivery", desc: "Optimized logistics networks to get your items to you in record time." },
              { icon: Globe, title: "Global Selection", desc: "Curated premium products sourced from trusted international brands." },
              { icon: Headphones, title: "24/7 Support", desc: "Our dedicated customer success team is always ready to assist you." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
                <div className="h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-orange transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-20 bg-brand-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-orange-400/30">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Premium Brands" },
              { number: "99%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Dedicated Support" },
            ].map((stat, idx) => (
              <div key={idx} className="p-4">
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                <div className="text-orange-100 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEVELOPER SECTION */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 bg-brand-orange/5 relative min-h-[400px] flex items-center justify-center p-8">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
                <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-brand-orange/10">
                  <Image 
                    src="https://ik.imagekit.io/ubwpdqyav/my_photo-removebg-preview.png?updatedAt=1776774813574"
                    alt="MD Abu Hanif Mia"
                    fill
                    className="object-cover scale-110 translate-y-4"
                  />
                </div>
              </div>
              <div className="md:col-span-3 p-10 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center space-x-2 bg-orange-100 text-brand-orange px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase mb-6 w-max">
                  <Users size={16} /> <span>Lead Developer & Architect</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                  MD Abu Hanif Mia
                </h2>
                <h3 className="text-xl text-gray-500 font-medium mb-6">
                  Full Stack Web Architect
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  The visionary mind behind Nexus Shop's robust architecture. Dedicated to building scalable, high-performance, and visually stunning web experiences that elevate international e-commerce standards.
                </p>

                <div className="flex items-start space-x-3 text-gray-500 mb-8">
                  <MapPin className="text-brand-orange shrink-0 mt-1" size={20} />
                  <span className="text-lg">2300 Kishoreganj Sadar, Dhaka, Bangladesh</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.1A5.2 5.2 0 0 0 19 5.2a5.2 5.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a11.5 11.5 0 0 0-6 0C7.1 1.7 6 2 6 2a5.2 5.2 0 0 0-.1 3.2A5.2 5.2 0 0 0 4 8.2c0 5.7 3.3 6.7 6.5 7.1a4.8 4.8 0 0 0-1 3.03V22"></path><path d="M9 20c-5 1.5-5-2.5-7-3"></path></svg>
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-[#0866FF] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-[#0A66C2] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-[#FF0000] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-[#E1306C] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-gray-100 text-gray-600 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL STANDARDS — required E-E-A-T content for Google News */}
      <section className="py-24 bg-white border-t border-gray-100" id="editorial-standards">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-3">Transparency</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Editorial Standards &amp; Policies</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We believe readers deserve to know exactly who is writing, how we pick products, and how we handle corrections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "Our Editorial Mission",
                body: "The Nexus Journal publishes original, research-backed articles on affiliate marketing, technology, and lifestyle. Every piece is written or reviewed by a named editor before publication. We do not publish auto-generated or scraped content.",
              },
              {
                title: "Affiliate Disclosure",
                body: "Some links on this site are affiliate links. If you click and make a purchase, we may earn a commission at no extra cost to you. This never influences our editorial opinions — we only recommend products we genuinely believe in.",
              },
              {
                title: "Corrections Policy",
                body: "We are committed to accuracy. If you find a factual error, please email corrections@shop.nexuscalculator.net. Significant corrections are noted at the top of the article with the date of revision. Minor typos are fixed silently.",
              },
              {
                title: "Content Independence",
                body: "Sponsored posts are clearly labelled 'Sponsored' or 'Advertisement' in both the headline and the article body. Sponsored content does not influence our editorial coverage of any brand, product, or category.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Contact info — required for Google News eligibility */}
          <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Contact the Editorial Team</h3>
              <p className="text-gray-600 text-sm">For story tips, corrections, or press inquiries:</p>
              <div className="mt-3 space-y-1 text-sm">
                <p><span className="font-semibold text-gray-700">General:</span> <a href="mailto:support@shop.nexuscalculator.net" className="text-brand-orange hover:underline">support@shop.nexuscalculator.net</a></p>
                <p><span className="font-semibold text-gray-700">Corrections:</span> <a href="mailto:corrections@shop.nexuscalculator.net" className="text-brand-orange hover:underline">corrections@shop.nexuscalculator.net</a></p>
                <p><span className="font-semibold text-gray-700">Address:</span> 2300 Kishoreganj Sadar, Dhaka, Bangladesh</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-brand-orange text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-orange/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
            
            <h2 className="relative z-10 text-3xl font-bold text-white sm:text-4xl mb-6">
              Experience the Nexus Difference
            </h2>
            <p className="relative z-10 text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have upgraded their shopping experience with Nexus Shop. Discover premium products today.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-brand-orange hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
              >
                Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-700 text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
