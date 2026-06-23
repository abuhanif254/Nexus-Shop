import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12">
      <div className="w-full relative overflow-hidden bg-brand-orange rounded-xl shadow-premium hover:shadow-premium-hover transition-shadow duration-300 group">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-20 right-20 w-60 h-60 bg-white rounded-full mix-blend-overlay blur-3xl group-hover:translate-x-10 transition-transform duration-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-10 md:px-12 md:py-8 min-h-[140px] gap-6 text-center md:text-left">
          
          {/* Text Content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-300 font-bold mb-2 tracking-widest text-xs uppercase">
              <Sparkles size={14} />
              <span>Bay Press Special Offer</span>
            </div>
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide leading-tight">
              Womens & Mens Clothes <br className="hidden md:block" /> Sale Up To 70% Off
            </h2>
          </div>

          {/* Call to Action */}
          <div className="flex-shrink-0 relative z-20 mt-4 md:mt-0">
            <Link 
              href="/category/fashion-clothing" 
              className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all flex items-center justify-center gap-3 group/btn uppercase tracking-wider text-sm"
            >
              Shop Now 
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
