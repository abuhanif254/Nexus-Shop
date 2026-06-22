import { Truck, Clock, ShieldCheck, CreditCard } from "lucide-react";

export default function TrustBenefits() {
  const benefits = [
    {
      id: 1,
      icon: <Truck size={32} className="text-brand-orange" />,
      title: "Free Shipping",
      description: "On all orders over $50"
    },
    {
      id: 2,
      icon: <Clock size={32} className="text-brand-orange" />,
      title: "24/7 Support",
      description: "Ready to help you"
    },
    {
      id: 3,
      icon: <ShieldCheck size={32} className="text-brand-orange" />,
      title: "Secure Payment",
      description: "100% protected"
    },
    {
      id: 4,
      icon: <CreditCard size={32} className="text-brand-orange" />,
      title: "Money Back",
      description: "30 days guarantee"
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-8 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4 group">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform">
              <div className="scale-75 md:scale-100">
                {benefit.icon}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm md:text-lg leading-tight mb-1">{benefit.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm leading-snug hidden sm:block">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
