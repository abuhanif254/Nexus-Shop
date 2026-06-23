"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Phone, 
  HelpCircle, 
  Globe, 
  Truck, 
  User,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
  LogOut
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange px-1 rounded-sm font-bold">{part}</span> 
          : <span key={i}>{part}</span>
      )}
    </>
  );
};

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const { getCartCount, getCartTotal, getWishlistCount, setWishlist, setIsCartOpen } = useCartStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync wishlist from database
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          if (data.items) {
            setWishlist(data.items);
          }
        })
        .catch(err => console.error("Error fetching wishlist:", err));
    }
  }, [status, setWishlist]);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className="bg-gray-50 dark:bg-[#151515] border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span>Shopping Hotline:</span>
            <a href="tel:+16585675839" className="text-brand-orange font-semibold">
              (+1) 658 567 - 5839
            </a>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Language Switcher */}
            <div className="relative group/lang cursor-pointer hover:text-brand-orange py-2">
              <div className="flex items-center gap-1">
                <Globe size={14} /> {language} <ChevronDown size={12} />
              </div>
              {/* Language Dropdown */}
              <div className="absolute top-full left-0 mt-0 w-32 bg-white rounded shadow-lg border border-gray-100 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-50 py-2">
                <ul className="text-gray-600 text-xs">
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setLanguage('English')}>🇬🇧 English</li>
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setLanguage('Español')}>🇪🇸 Español</li>
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setLanguage('Français')}>🇫🇷 Français</li>
                </ul>
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="relative group/curr cursor-pointer hover:text-brand-orange py-2">
              <div className="flex items-center gap-1">
                {currency} <ChevronDown size={12} />
              </div>
              {/* Currency Dropdown */}
              <div className="absolute top-full left-0 mt-0 w-24 bg-white rounded shadow-lg border border-gray-100 opacity-0 invisible group-hover/curr:opacity-100 group-hover/curr:visible transition-all duration-200 z-50 py-2">
                <ul className="text-gray-600 text-xs">
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setCurrency('USD')}>$ USD</li>
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setCurrency('EUR')}>€ EUR</li>
                  <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors" onClick={() => setCurrency('GBP')}>£ GBP</li>
                </ul>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-1 cursor-pointer hover:text-brand-orange">
                Recent Viewed <ChevronDown size={12} />
              </div>
              <Link href="/account/orders" className="flex items-center gap-1 hover:text-brand-orange"><Truck size={14} /> Order Tracking</Link>
              {status === 'loading' ? (
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
              ) : session ? (
                <div className="relative group/user cursor-pointer py-2">
                  <div className="flex items-center gap-2 text-brand-orange font-semibold">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-5 h-5 rounded-full" />
                    ) : (
                      <div className="w-5 h-5 bg-brand-orange text-white flex items-center justify-center rounded-full text-xs">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    {session.user?.name?.split(' ')[0] || 'User'} <ChevronDown size={12} />
                  </div>
                  <div className="absolute top-full right-0 mt-0 w-48 bg-white rounded shadow-lg border border-gray-100 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-gray-900 font-bold text-sm">{session.user?.name}</p>
                      <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                    </div>
                    <ul className="text-gray-600 text-sm">
                      {session.user?.email === "mohammadbitullah3@gmail.com" && (
                        <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors"><Link href="/admin/products">Admin Dashboard</Link></li>
                      )}
                      <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors"><Link href="/account/orders">Order History</Link></li>
                      <li className="px-4 py-2 hover:bg-orange-50 hover:text-brand-orange transition-colors"><Link href="/wishlist">Wishlist</Link></li>
                      <li className="px-4 py-2 hover:bg-orange-50 text-red-500 hover:text-red-600 transition-colors cursor-pointer border-t border-gray-50 mt-1 flex items-center gap-2" onClick={() => signOut()}>
                        <LogOut size={14} /> Logout
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-1 hover:text-brand-orange"><User size={14} /> Login Or Register</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Container Wrapper */}
      <div className={`w-full sticky top-0 transition-all duration-500 z-40 ${isScrolled ? 'glass dark:glass-darker shadow-[0_4px_30px_rgba(0,0,0,0.05)]' : 'bg-white dark:bg-background border-b border-transparent dark:border-gray-800'}`}>
        {/* Main Header */}
        <div className={`container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8 transition-all duration-300 ${isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'}`}>
          
          {/* Mobile Hamburger (visible on small screens) */}
          <button 
            className="lg:hidden text-brand-dark p-1 focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu size={28} />
          </button>

          {/* Logo */}
          <Link href="/" className={`flex items-center gap-2 font-bold text-brand-dark dark:text-white flex-1 lg:flex-none justify-center lg:justify-start transition-all duration-300 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
            <div className={`bg-brand-orange text-white rounded-md transition-all duration-300 flex items-center justify-center ${isScrolled ? 'w-7 h-7 p-1' : 'w-9 h-9 p-1.5'}`}>
              <ShoppingCart size={isScrolled ? 18 : 22} />
            </div>
            Nexus Shop
          </Link>

          {/* Search Bar (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative group">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setIsSearchFocused(false);
                }
              }}
              className={`flex w-full border-2 transition-all duration-300 rounded-full overflow-hidden bg-white dark:bg-gray-900 ${isSearchFocused ? 'border-brand-orange shadow-lg ring-4 ring-brand-orange/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
            >
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-semibold cursor-pointer flex items-center gap-2 min-w-fit">
                All Category <ChevronDown size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search for items..." 
                className="flex-1 px-4 outline-none bg-transparent dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow clicks
                aria-label="Search input"
              />
              <button type="submit" className="bg-brand-orange px-6 text-white hover:bg-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white outline-none" aria-label="Submit search">
                <Search size={20} />
              </button>
            </form>

            {/* Mega Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 glass dark:glass-darker rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-3 gap-6">
                  {/* Recent Searches */}
                  <div className="col-span-1 border-r border-gray-100 pr-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Searches</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="hover:text-brand-orange cursor-pointer transition-colors flex items-center gap-2"><Search size={14} className="text-gray-400"/> Wireless Headphones</li>
                      <li className="hover:text-brand-orange cursor-pointer transition-colors flex items-center gap-2"><Search size={14} className="text-gray-400"/> Smart Watch 2024</li>
                      <li className="hover:text-brand-orange cursor-pointer transition-colors flex items-center gap-2"><Search size={14} className="text-gray-400"/> Gaming Keyboard</li>
                    </ul>
                  </div>

                  {/* Suggested Products */}
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      {searchQuery.trim() ? "Search Results" : "Trending Products"}
                    </h4>
                    
                    {isSearching ? (
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                              <div className="h-3 bg-brand-orange/30 dark:bg-brand-orange/20 rounded w-1/4"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery.trim() && searchResults.length === 0 ? (
                      <div className="text-sm text-gray-500 py-4">No products found matching "{searchQuery}".</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {(searchQuery.trim() ? searchResults : [
                          {
                            title: "Sony WH-1000XM5 Noise Canceling",
                            price: 348.00,
                            image: "/mock-product-1.jpg",
                            slug: "sony-wh-1000xm5"
                          },
                          {
                            title: "Apple iPad Pro 11-inch",
                            price: 799.00,
                            image: "/mock-product-2.jpg",
                            slug: "apple-ipad-pro"
                          }
                        ]).map((item: any, idx: number) => {
                          const slug = item.slug || item.title.toLowerCase().replace(/ /g, '-');
                          return (
                            <Link href={`/product/${slug}`} key={idx} className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors group/item">
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <img src={item.image.startsWith('/') ? item.image : `/${item.image}.jpg`} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                                ) : (
                                  <span className="text-xs text-gray-400">Img</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover/item:text-brand-orange dark:group-hover/item:text-brand-orange transition-colors">
                                  <HighlightMatch text={item.title} query={searchQuery} />
                                </p>
                                <p className="text-brand-orange font-bold text-sm">${item.price.toFixed(2)}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/wishlist" className="relative flex items-center hover:text-brand-orange hover:scale-110 active:scale-95 transition-all duration-300">
              <Heart size={28} className="text-gray-700 dark:text-gray-300 hover:text-brand-orange dark:hover:text-brand-orange transition-colors" />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                {mounted ? getWishlistCount() : 0}
              </span>
            </Link>
            <button onClick={() => setIsCartOpen(true)} aria-label="Open Shopping Cart" className="flex items-center gap-3 group hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded p-1">
              <div className="relative">
                <ShoppingCart size={28} className="text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in text-brand-dark">
                  {mounted ? getCartCount() : 0}
                </span>
              </div>
              <div className="hidden sm:block text-sm text-left">
                <p className="text-gray-500 dark:text-gray-400 mb-0.5">Shopping Cart</p>
                <p className="font-bold text-brand-dark dark:text-white">${mounted ? getCartTotal().toFixed(2) : "0.00"}</p>
              </div>
            </button>
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
          className="lg:hidden container mx-auto px-4 pb-4"
        >
          <div className="flex w-full border-2 border-gray-200 dark:border-gray-800 focus-within:border-brand-orange focus-within:ring-4 focus-within:ring-brand-orange/10 transition-all rounded-full overflow-hidden bg-white dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Search for items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 outline-none text-sm bg-transparent dark:text-white"
              aria-label="Mobile Search Input"
            />
            <button type="submit" className="bg-brand-orange px-4 text-white hover:bg-orange-600 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white outline-none" aria-label="Submit search">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Navigation (Desktop) */}
        <div className={`bg-brand-orange text-white hidden lg:block transition-all ${isScrolled ? 'hidden lg:hidden' : ''}`}>
          <div className="container mx-auto px-4 flex items-center">
          {/* All Departments Dropdown Trigger */}
          <div className="bg-brand-dark px-6 py-4 flex items-center gap-3 w-64 cursor-pointer font-semibold relative group">
            <Menu size={20} className="text-white" />
            <span className="text-white">All Departments</span>
            
            {/* Mega Menu Dropdown (visible on hover) */}
            <div className="absolute top-full left-0 w-[850px] glass dark:glass-darker shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0 rounded-br-2xl rounded-bl-2xl overflow-hidden flex border-t-0 border border-gray-100 dark:border-gray-800">
              
              {/* Columns */}
              <div className="flex-1 p-8 grid grid-cols-3 gap-8 bg-white/40 dark:bg-[#111111]/40">
                {/* Column 1 */}
                <div>
                  <h4 className="text-brand-dark dark:text-white font-black mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 tracking-tight">Electronics</h4>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-3 text-sm">
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/electronics">Smartphones</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/electronics">Laptops & PCs</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/electronics">Audio & Headphones</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/electronics">Smart Watches</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/electronics">Cameras & Drones</Link></li>
                  </ul>
                </div>
                
                {/* Column 2 */}
                <div>
                  <h4 className="text-brand-dark dark:text-white font-black mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 tracking-tight">Home & Lifestyle</h4>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-3 text-sm">
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/home">Living Room</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/home">Kitchen Appliances</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/home">Smart Home</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/home">Decor & Furniture</Link></li>
                    <li className="hover:text-brand-orange dark:hover:text-brand-orange hover:translate-x-1 transition-transform"><Link href="/category/home">Lighting</Link></li>
                  </ul>
                </div>

                {/* Column 3 (Visual Links) */}
                <div className="flex flex-col gap-4">
                  <Link href="/category/audio" className="group/megaimg block overflow-hidden rounded-xl relative h-[130px] shadow-sm">
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-300 dark:text-blue-500/50">
                       [Headphones Image]
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex items-end p-4 transition-opacity group-hover/megaimg:bg-black/50">
                       <div>
                         <span className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-1 block">New Arrival</span>
                         <span className="text-white font-bold leading-tight block">Premium Audio</span>
                       </div>
                    </div>
                  </Link>

                  <Link href="/category/home" className="group/megaimg block overflow-hidden rounded-xl relative h-[130px] shadow-sm">
                    <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-300 dark:text-orange-500/50">
                       [Living Room Image]
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex items-end p-4 transition-opacity group-hover/megaimg:bg-black/50">
                       <div>
                         <span className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-1 block">Up to 30% Off</span>
                         <span className="text-white font-bold leading-tight block">Modern Furniture</span>
                       </div>
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Menu */}
          <nav className="flex-1 flex items-center justify-between px-6">
            <ul className="flex items-center gap-6 text-sm font-semibold">
              <li><Link href="/" className="hover:text-yellow-300 flex items-center gap-1">Home <ChevronDown size={14} /></Link></li>
              <li><Link href="/shop" className="hover:text-yellow-300 flex items-center gap-1">Shop</Link></li>
              <li><Link href="/pages" className="hover:text-yellow-300 flex items-center gap-1">Pages <ChevronDown size={14} /></Link></li>
              <li><Link href="/electronics" className="hover:text-yellow-300 flex items-center gap-1">Electronics Devices <ChevronDown size={14} /></Link></li>
              <li><Link href="/blog" className="hover:text-yellow-300 flex items-center gap-1">Blog <ChevronDown size={14} /></Link></li>
              <li><Link href="/vendor" className="hover:text-yellow-300">Become A Vendor</Link></li>
            </ul>
            <div className="text-sm font-bold animate-pulse cursor-pointer border-b border-transparent hover:border-white transition-colors">
              Flash Deals
            </div>
          </nav>
        </div>
      </div>
    </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -100 || velocity.x < -500) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="relative flex w-[85%] max-w-sm flex-col h-full bg-white dark:bg-gray-900 shadow-2xl overflow-hidden rounded-r-2xl border-r border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <span className="font-bold text-xl text-brand-dark dark:text-white flex items-center gap-2">
                  <div className="bg-brand-orange text-white p-1.5 rounded-md">
                    <ShoppingCart size={20} />
                  </div>
                  Nexus Shop
                </span>
                <button 
                  className="p-2 text-gray-500 hover:text-brand-orange bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-brand-orange outline-none rounded-full transition-all active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Mobile Menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-6 py-6 overflow-y-auto overscroll-contain">
                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-brand-orange inline-block"></span> Main Menu
                </h4>
                <div className="space-y-2 mb-8">
                  <Link href="/" className="block text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-orange p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link href="/shop" className="block text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-orange p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                  <Link href="/blog" className="block text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-orange p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                </div>

                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-brand-orange inline-block"></span> Categories
                </h4>
                <div className="space-y-1">
                  <Link href="/category/electronic-devices" className="block text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:text-brand-orange p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Electronic Devices</Link>
                  <Link href="/category/tv-home-appliances" className="block text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:text-brand-orange p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>TV & Home Appliances</Link>
                  <Link href="/category/health-beauty" className="block text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:text-brand-orange p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Health & Beauty</Link>
                  <Link href="/category/home-kitchen" className="block text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:text-brand-orange p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home & Kitchen</Link>
                  <Link href="/category/fashion-clothing" className="block text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:text-brand-orange p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Fashion & Clothing</Link>
                </div>
              </nav>
              <div className="p-6 bg-gray-50 dark:bg-[#111111] border-t border-gray-100 dark:border-gray-800 mt-auto">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="User" className="w-12 h-12 rounded-full border-2 border-brand-orange" />
                      ) : (
                        <div className="w-12 h-12 bg-brand-orange text-white flex items-center justify-center rounded-full text-xl font-bold shadow-md">
                          {session.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white font-bold truncate">{session.user?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    {session.user?.email === "mohammadbitullah3@gmail.com" && (
                      <Link href="/admin/products" className="block text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <Link href="/account/orders" className="block text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Order History</Link>
                    <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold py-3 mt-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center justify-center gap-2 w-full bg-brand-orange text-white font-semibold py-4 rounded-xl shadow-premium hover:bg-orange-600 transition-colors active:scale-95" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} /> Login or Register
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
