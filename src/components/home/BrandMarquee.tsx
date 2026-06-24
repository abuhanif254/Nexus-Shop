import { MonitorSmartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Tv, Speaker, Phone, Tablet, Image as ImageIcon } from "lucide-react";
import { db } from "@/db";
import { brands } from "@/db/schema";

export default async function BrandMarquee() {
  const allBrands = await db.select().from(brands);

  // Fallback to static brands if the database is empty, to keep the marquee looking good initially
  const displayBrands = allBrands.length > 0 ? allBrands : [
    { name: "Apple", logo: null },
    { name: "Samsung", logo: null },
    { name: "Sony", logo: null },
    { name: "Dell", logo: null },
    { name: "Bose", logo: null },
  ];

  return (
    <div className="bg-white border-t border-b border-gray-100 py-10 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Trusted by Top Brands</h3>
      </div>
      
      {/* Removed Gradient fades per user request */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* We duplicate the array 3 times to ensure infinite scroll fills the screen */}
        {[...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands].map((brand, i) => (
          <div key={i} className="flex flex-col items-center justify-center min-w-[150px] md:min-w-[200px] group cursor-pointer px-8">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-300">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <ImageIcon size={40} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
              )}
            </div>
            <span className="mt-3 font-semibold text-gray-500 group-hover:text-brand-orange transition-colors">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
