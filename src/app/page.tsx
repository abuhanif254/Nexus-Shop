import SidebarMenu from "@/components/layout/SidebarMenu";
import HeroSection from "@/components/home/HeroSection";
import TrustBenefits from "@/components/home/TrustBenefits";
import FlashDeals from "@/components/home/FlashDeals";

import RecommendedForYou from "@/components/product/RecommendedForYou";
import RecentlyViewedProducts from "@/components/product/RecentlyViewedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import PopularCategories from "@/components/home/PopularCategories";
import RecommendedProducts from "@/components/home/RecommendedProducts";
import BrandMarquee from "@/components/home/BrandMarquee";
import Newsletter from "@/components/home/Newsletter";
import FadeIn from "@/components/ui/FadeIn";
import { db } from '@/db';
import { products } from '@/db/schema';

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const allProducts = await db.select().from(products);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Nexus Shop',
      url: 'https://www.shop.nexuscalculator.net',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.shop.nexuscalculator.net/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Nexus Shop',
      url: 'https://www.shop.nexuscalculator.net',
      logo: 'https://www.shop.nexuscalculator.net/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-555-0199',
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish']
      },
      sameAs: [
        'https://facebook.com/saheragroup',
        'https://twitter.com/saheragroup',
        'https://instagram.com/saheragroup'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top Section with Sidebar and Hero */}
      <section className="container mx-auto px-4 max-w-[1400px] flex pt-6 pb-8 md:pb-12 gap-6">
        <aside className="hidden lg:block">
          <SidebarMenu />
        </aside>
        <div className="flex-1 overflow-hidden">
          <FadeIn direction="none">
            <HeroSection />
          </FadeIn>
        </div>
      </section>

      {/* Trust & Benefits */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn delay={200}>
          <TrustBenefits />
        </FadeIn>
      </section>

      {/* Lightning Deals Section */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn>
          <FlashDeals initialProducts={allProducts} />
        </FadeIn>
      </section>

      {/* Promo Banner */}
      <FadeIn delay={100}>
        <PromoBanner />
      </FadeIn>

      {/* Popular Categories */}
      <FadeIn>
        <PopularCategories />
      </FadeIn>

      {/* Recommended Products (Static) */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn delay={100}>
          <RecommendedProducts initialProducts={allProducts} />
        </FadeIn>
      </section>

      {/* Personalized Recommendations */}
      <FadeIn>
        <RecommendedForYou />
      </FadeIn>

      {/* Recently Viewed */}
      <FadeIn>
        <RecentlyViewedProducts />
      </FadeIn>

      {/* Brand Marquee */}
      <FadeIn delay={200}>
        <BrandMarquee />
      </FadeIn>

      {/* Newsletter */}
      <section className="container mx-auto px-4 max-w-[1400px] py-12 md:py-20">
        <FadeIn delay={100}>
          <Newsletter />
        </FadeIn>
      </section>
    </main>
  );
}
