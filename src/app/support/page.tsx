import { LifeBuoy, Package, RefreshCcw, Truck, MessageCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Support Center | Nexus Shop",
  description: "Welcome to the Nexus Shop Support Center. Find answers to your questions, track your orders, or contact our 24/7 customer service team.",
  keywords: "support center, help center, customer service, Nexus Shop support, contact us, order tracking",
};

const supportCategories = [
  {
    title: "Track Your Order",
    description: "Check the real-time status of your recent purchases.",
    icon: Package,
    href: "/track-order",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Returns & Exchanges",
    description: "Learn how to return or exchange an item easily.",
    icon: RefreshCcw,
    href: "/returns",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Shipping Policy",
    description: "Information on delivery times, costs, and methods.",
    icon: Truck,
    href: "/shipping",
    color: "bg-orange-50 text-brand-orange",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find quick answers to our most common questions.",
    icon: MessageCircle,
    href: "/faq",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Terms & Conditions",
    description: "Read the rules and guidelines for using our service.",
    icon: FileText,
    href: "/terms",
    color: "bg-gray-100 text-gray-700",
  },
];

export default function SupportCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <LifeBuoy size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            How can we help?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to the Nexus Shop Support Center. Choose a category below to find the answers you need quickly.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        
        {/* GRID OF CATEGORIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category) => (
            <Link 
              key={category.title} 
              href={category.href}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${category.color}`}>
                <category.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                {category.description}
              </p>
              <div className="mt-auto flex items-center text-sm font-bold text-brand-orange group-hover:gap-2 transition-all">
                View Details <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
          
          {/* CONTACT US CARD - SPANS FULL WIDTH ON MOBILE, OR FILLS EMPTY GRID SPACES */}
          <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg sm:col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange opacity-20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3">Still need help?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                Can't find what you're looking for? Our dedicated customer support team is available 24/7 to assist you.
              </p>
            </div>
            <Link 
              href="/contact" 
              className="relative z-10 w-full py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-premium flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
