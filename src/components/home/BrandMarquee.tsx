import { MonitorSmartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Tv, Speaker, Phone, Tablet } from "lucide-react";

const brands = [
  { name: "Apple", icon: <MonitorSmartphone size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Samsung", icon: <Phone size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Sony", icon: <Tv size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Dell", icon: <Laptop size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Bose", icon: <Headphones size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Canon", icon: <Camera size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Garmin", icon: <Watch size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Nintendo", icon: <Gamepad2 size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "JBL", icon: <Speaker size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
  { name: "Lenovo", icon: <Tablet size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" /> },
];

export default function BrandMarquee() {
  return (
    <div className="bg-white border-t border-b border-gray-100 py-10 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Trusted by Top Brands</h3>
      </div>
      
      {/* Removed Gradient fades per user request */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* We duplicate the array 3 times to ensure infinite scroll fills the screen */}
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex flex-col items-center justify-center min-w-[150px] md:min-w-[200px] group cursor-pointer px-8">
            {brand.icon}
            <span className="mt-3 font-semibold text-gray-500 group-hover:text-brand-orange transition-colors">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
