"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { name: "All", slug: "all" },
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Audio & Video", slug: "audio-video" },
  { name: "Cameras", slug: "cameras" },
  { name: "Wearables", slug: "wearables" },
  { name: "Gaming", slug: "gaming" },
  { name: "Home Appliances", slug: "home-appliances" }
];

export default function CategoryPills() {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || 'all';

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 mb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {categories.map((cat) => {
        const isActive = currentSlug === cat.slug || (currentSlug === 'shop' && cat.slug === 'all');
        const href = cat.slug === 'all' ? '/shop' : `/category/${cat.slug}`;
        
        return (
          <Link
            key={cat.slug}
            href={href}
            className={`snap-start whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:-translate-y-0.5 ${
              isActive 
                ? 'bg-brand-dark text-white shadow-md border border-brand-dark' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-brand-orange hover:shadow-premium'
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
