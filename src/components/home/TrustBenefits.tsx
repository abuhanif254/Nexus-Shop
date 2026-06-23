import { Truck, Clock, ShieldCheck, CreditCard } from "lucide-react";

export default function TrustBenefits() {
  const benefits = [
    {
      id: 1,
      icon: <Truck size={32} className="text-brand-orange" />,
      title: "Fast Delivery",
      description: "All over Bangladesh"
    },
    {
      id: 2,
      icon: <ShieldCheck size={32} className="text-brand-orange" />,
      title: "Authentic Products",
      description: "100% Genuine Brands"
    },
    {
      id: 3,
      icon: <CreditCard size={32} className="text-brand-orange" />,
      title: "Secure Payment",
      description: "bKash & Cards accepted"
    },
    {
      id: 4,
      icon: <Clock size={32} className="text-brand-orange" />,
      title: "24/7 Support",
      description: "Always here for you"
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
      <div className="mb-8 md:mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Why Choose Nexus Shop?</h2>
        <p className="text-gray-500 mt-2">Experience the best e-commerce service in Bangladesh.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex flex-col items-center text-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:-translate-y-2 transition-transform duration-300">
              {benefit.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm md:text-lg leading-tight mb-1">{benefit.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm leading-snug">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
