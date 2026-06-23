import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function PopularCategories() {
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt)).limit(10);

  return (
    <div className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Most Popular Categories</h2>
        <Link href="/categories" className="text-sm text-gray-500 hover:text-brand-orange flex items-center gap-1 transition-colors">
          See all categories <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide lg:grid lg:grid-cols-6 lg:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {allCategories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="group min-w-[150px] snap-start">
            <div className="bg-gray-50 rounded-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 transition-all hover:border-brand-orange hover:shadow-md h-40">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">[{cat.name.substring(0,4)}]</span>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-orange text-center">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
