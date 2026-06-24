"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryPills({ categories = [] }: { categories?: any[] }) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || 'all';

  const displayCategories = [
    { name: "All", slug: "all" },
    ...categories.map(c => ({ name: c.name, slug: c.slug }))
  ];

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 mb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {displayCategories.map((cat) => {
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
