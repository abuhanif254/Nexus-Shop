import Link from "next/link";
import { ChevronRight } from "lucide-react";

const categories = [
  { id: 1, name: "Smartphones", image: "phones" },
  { id: 2, name: "Laptops", image: "laptops" },
  { id: 3, name: "Audio & Video", image: "audio" },
  { id: 4, name: "Cameras", image: "cameras" },
  { id: 5, name: "Wearables", image: "wearables" },
  { id: 6, name: "Gaming", image: "gaming" },
];

export default function PopularCategories() {
  return (
    <div className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Most Popular Categories</h2>
        <Link href="/categories" className="text-sm text-gray-500 hover:text-brand-orange flex items-center gap-1 transition-colors">
          See all categories <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide lg:grid lg:grid-cols-6 lg:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="group min-w-[150px] snap-start">
            <div className="bg-gray-50 rounded-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 transition-all hover:border-brand-orange hover:shadow-md h-40">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                [{cat.image}]
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-orange text-center">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
