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
import { db } from "@/db";
import { products } from "@/db/schema";
import type { Metadata } from "next";

// ISR — revalidate every hour; avoids the cold-start penalty of force-dynamic
// while keeping product data reasonably fresh.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nexus Shop | Premium Affiliate Deals & Expert Picks",
  description: "Discover the best affiliate deals, expert product picks and industry insights at Nexus Shop — powered by Sahera Group.",
};

export default async function Home() {
  const allProducts = await db.select().from(products);

  return (
    <main className="min-h-screen bg-white">

      {/* ── Top section: sidebar + hero carousel ── */}
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

      {/* ── Flash Deals ── */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn>
          <FlashDeals initialProducts={allProducts} />
        </FadeIn>
      </section>

      {/* ── Affiliate Promo Banner ── */}
      <FadeIn delay={100}>
        <PromoBanner />
      </FadeIn>

      {/* ── Popular Categories ── */}
      <FadeIn>
        <PopularCategories />
      </FadeIn>

      {/* ── Recommended Products ── */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn delay={100}>
          <RecommendedProducts initialProducts={allProducts} />
        </FadeIn>
      </section>

      {/* ── Personalised Recommendations (client, fetches on mount) ── */}
      <FadeIn>
        <RecommendedForYou />
      </FadeIn>

      {/* ── Recently Viewed (client, reads localStorage) ── */}
      <FadeIn>
        <RecentlyViewedProducts />
      </FadeIn>

      {/* ── Brand Marquee ── */}
      <FadeIn delay={200}>
        <BrandMarquee />
      </FadeIn>

      {/* ── Trust & Benefits ── */}
      <section className="container mx-auto px-4 max-w-[1400px] py-8 md:py-12 border-t border-gray-100">
        <FadeIn delay={200}>
          <TrustBenefits />
        </FadeIn>
      </section>

      {/* ── Newsletter ── */}
      <section className="container mx-auto px-4 max-w-[1400px] py-12 md:py-20">
        <FadeIn delay={100}>
          <Newsletter />
        </FadeIn>
      </section>

    </main>
  );
}
