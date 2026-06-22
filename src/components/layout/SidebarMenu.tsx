import Link from 'next/link';
import { 
  Monitor, 
  Headphones, 
  Tv, 
  Activity, 
  Baby, 
  Home, 
  Shirt, 
  Plane, 
  Book, 
  Flower2, 
  Coffee, 
  Speaker,
  ChevronRight
} from 'lucide-react';

const categories = [
  { name: 'Electronic Devices', icon: Monitor, hasSubmenu: true },
  { name: 'Electronic Accessories', icon: Headphones, hasSubmenu: true },
  { name: 'TV & Home Appliances', icon: Tv, hasSubmenu: false },
  { name: 'Health & Beauty', icon: Activity, hasSubmenu: false },
  { name: 'Babies & Toys', icon: Baby, hasSubmenu: false },
  { name: 'Home & Kitchen', icon: Home, hasSubmenu: true },
  { name: 'Fashion & Clothing', icon: Shirt, hasSubmenu: false },
  { name: 'Sports & Travel', icon: Plane, hasSubmenu: false },
  { name: 'Book & Audible', icon: Book, hasSubmenu: false },
  { name: 'Garden', icon: Flower2, hasSubmenu: false },
  { name: 'Pantry Food & Pet Supplies', icon: Coffee, hasSubmenu: false },
  { name: 'Home Audio', icon: Speaker, hasSubmenu: false },
];

export default function SidebarMenu() {
  return (
    <div className="w-64 bg-white border border-gray-200 rounded-b-md shadow-sm h-full font-sans">
      <ul className="py-2">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <li key={index} className="group border-b border-gray-100 last:border-none relative">
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 hover:text-brand-orange transition-colors"
              >
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-brand-orange">
                  <Icon size={18} className="text-gray-400 group-hover:text-brand-orange" />
                  {category.name}
                </div>
                {category.hasSubmenu && (
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                )}
              </Link>
              
              {/* Flyout Submenu */}
              {category.hasSubmenu && (
                <div className="absolute left-[100%] top-0 w-[500px] bg-white border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-6 flex gap-6 rounded-r-md">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Top {category.name}</h4>
                    <ul className="space-y-3">
                      <li><Link href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-gray-500 hover:text-brand-orange hover:translate-x-1 transition-all inline-block">Best Sellers</Link></li>
                      <li><Link href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-gray-500 hover:text-brand-orange hover:translate-x-1 transition-all inline-block">New Arrivals</Link></li>
                      <li><Link href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-gray-500 hover:text-brand-orange hover:translate-x-1 transition-all inline-block">Top Rated</Link></li>
                      <li><Link href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-gray-500 hover:text-brand-orange hover:translate-x-1 transition-all inline-block">Clearance Sale</Link></li>
                    </ul>
                  </div>
                  <div className="w-[200px] h-full bg-gray-50 rounded-md border border-gray-100 flex flex-col items-center justify-center p-4">
                    <span className="text-xs font-bold uppercase text-brand-orange mb-2">Featured</span>
                    <div className="w-full h-[120px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                      [Promo Image]
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
