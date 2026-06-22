import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FilterSidebar from "@/components/category/FilterSidebar";
import MobileFilterWrapper from "@/components/category/MobileFilterWrapper";
import SortBar from "@/components/category/SortBar";
import ProductGrid from "@/components/category/ProductGrid";
import type { Metadata } from "next";

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const titleName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${titleName} | Besa E-Commerce`,
    description: `Shop the best ${titleName} online at Besa. Discover amazing deals on top brands.`,
  };
}

export default async function CategoryPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const slug = params.slug;
  const titleName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // SEO: ItemList Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": titleName,
        "url": `https://besa.example.com/category/${slug}`
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
          <span className="text-gray-400 capitalize">{slug.replace(/-/g, ' ')}</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 capitalize mb-2">{titleName}</h1>
            <p className="text-gray-500 text-sm">Showing results in {titleName}</p>
          </div>
        </div>

        {/* Layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <div className="w-full lg:w-1/4">
            <MobileFilterWrapper>
              <FilterSidebar />
            </MobileFilterWrapper>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
             {/* Controls */}
             <SortBar />

             {/* Grid */}
             <ProductGrid slug={slug} />
          </div>
        </div>

      </div>
    </div>
  );
}
