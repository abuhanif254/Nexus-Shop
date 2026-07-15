import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FilterSidebar from "@/components/category/FilterSidebar";
import MobileFilterWrapper from "@/components/category/MobileFilterWrapper";
import CategoryPills from "@/components/category/CategoryPills";
import SortBar from "@/components/category/SortBar";
import ProductGrid from "@/components/category/ProductGrid";
import ShopHeroBanner from "@/components/shop/ShopHeroBanner";
import AffiliateBanner from "@/components/ui/AffiliateBanner";
import type { Metadata } from "next";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";



export const metadata: Metadata = {
  title: "Shop All Products | Nexus Shop",
  description: "Browse our entire catalog of products at Nexus Shop. Find the best deals on electronics, home appliances, fashion, and more.",
};

export default async function ShopPage() {
  const titleName = "All Products";
  
  // Fetch dynamic categories and brands from DB
  const [dbCategories, dbBrands] = await Promise.all([
    db.select().from(categories),
    db.select().from(brands)
  ]);

  // SEO: ItemList Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": titleName,
        "url": `https://www.shop.nexuscalculator.net/shop`
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-400 capitalize">Shop</span>
        </nav>

        {/* Hero Banner */}
        <ShopHeroBanner />

        {/* Affiliate Banner — position=shop (auto-hidden if none configured) */}
        <AffiliateBanner position="shop" layout="horizontal" className="mb-6" />

        {/* Page Header */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize mb-1">{titleName}</h1>
            <p className="text-gray-500 text-sm">Showing all available products in our store</p>
          </div>
        </div>

        {/* Layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <div className="w-full lg:w-1/4">
            <MobileFilterWrapper>
              <FilterSidebar categories={dbCategories} brands={dbBrands} />
            </MobileFilterWrapper>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
             {/* Category Pills Navigation */}
             <CategoryPills categories={dbCategories} />

             {/* Controls */}
             <SortBar />

             {/* Grid */}
             {/* Using slug="search" will hit /api/search without a 'q' query, returning all products! */}
             <ProductGrid slug="search" />
          </div>
        </div>

      </div>
    </div>
  );
}
