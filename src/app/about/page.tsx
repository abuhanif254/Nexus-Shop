import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Globe, ArrowRight, Award, Users } from "lucide-react";

export const metadata = {
  title: "About Us | Nexus Shop by Sahera Group",
  description: "Learn about Nexus Shop, a proud company of Sahera Group. Discover our mission, values, and commitment to premium e-commerce in Bangladesh and beyond.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
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

      {/* 5. CTA SECTION */}
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
