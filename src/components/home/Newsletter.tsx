import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-8 py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between relative z-10 gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Newsletter & <span className="text-brand-orange">Get 10% Off</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Subscribe to our newsletter to receive the latest updates, special offers, and exclusive discounts directly in your inbox.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-lg py-4 pl-12 pr-4 outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/20 focus:bg-white/20 transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="bg-brand-orange text-white font-bold py-4 px-8 rounded-xl hover:bg-orange-600 focus:ring-4 focus:ring-brand-orange/50 transition-all shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 whitespace-nowrap outline-none"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center lg:text-left">
            By subscribing, you agree to our <a href="#" className="text-gray-400 hover:text-white underline">Privacy Policy</a> and consent to receive updates.
          </p>
        </div>
      </div>
    </div>
  );
}
