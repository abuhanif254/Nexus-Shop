import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Tag, FolderOpen, ArrowRight, Sparkles, Rss } from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import AffiliateBanner from "@/components/ui/AffiliateBanner";
import CategoryFilter from "@/components/blog/CategoryFilter";
import type { Metadata } from "next";

export const revalidate = 60; // ISR: revalidate every 60s

export const metadata: Metadata = {
  title: "Blog — The Nexus Journal | Nexus Shop",
  description: "Discover expert insights, affiliate deals, tips and industry news on The Nexus Journal — your guide to smarter shopping and lifestyle.",
};

function getReadingTime(content: string) {
  const text = content.replace(/<[^>]*>?/gm, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

// ── Small card (3-column grid) ────────────────────────────────────
function PostCard({ post }: { post: any }) {
  const rt = getReadingTime(post.content);
  const excerpt = post.excerpt || post.content.replace(/<[^>]*>?/gm, "").substring(0, 110) + "…";

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        {post.featuredImage ? (
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-orange-50">
            <span className="font-black text-4xl text-brand-orange/30">{post.title.charAt(0)}</span>
          </div>
        )}
        {/* Category badge */}
        {post.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-orange text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-orange-100">
            {post.category}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="text-gray-200">·</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {rt} min</span>
          {post.viewCount > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-1"><Eye size={10} /> {post.viewCount.toLocaleString()}</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="flex-1 block mb-3">
          <h2 className="text-base font-black text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          {post.author ? (
            <span className="text-[10px] font-bold text-gray-400">By {post.author}</span>
          ) : <span />}
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-black text-brand-orange hover:text-orange-600 transition-colors group/link">
            Read <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-50">
            {post.tags.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3).map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100">
                <Tag size={7} /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ── Wide card (2-column row) ────────────────────────────────────
function PostCardWide({ post }: { post: any }) {
  const rt = getReadingTime(post.content);
  const excerpt = post.excerpt || post.content.replace(/<[^>]*>?/gm, "").substring(0, 180) + "…";

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-row">
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="relative w-40 sm:w-48 shrink-0 overflow-hidden bg-gray-100">
        {post.featuredImage ? (
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-orange-50">
            <span className="font-black text-3xl text-brand-orange/30">{post.title.charAt(0)}</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-brand-orange text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-orange-100">
            {post.category}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="text-gray-200">·</span>
          <span className="flex items-center gap-1"><Clock size={9} /> {rt} min</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-sm font-black text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3 hidden sm:block">{excerpt}</p>
        <div className="flex items-center justify-between">
          {post.author ? <span className="text-[10px] font-bold text-gray-400">By {post.author}</span> : <span />}
          <Link href={`/blog/${post.slug}`} className="text-[10px] font-black text-brand-orange hover:text-orange-600 flex items-center gap-0.5 transition-colors">
            Read <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Fetch all published posts
  const allPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt));

  // Derive unique categories from real post data
  const categoryMap = new Map<string, number>();
  allPosts.forEach(p => {
    if (p.category) categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
  });
  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // Apply category filter
  const displayPosts = category
    ? allPosts.filter(p => p.category === category)
    : allPosts;

  const featured = displayPosts[0] || null;
  const secondary = displayPosts.slice(1, 3);     // 2 wide cards below featured
  const gridPosts = displayPosts.slice(3, 9);      // 3-column grid (up to 6)
  const morePosts = displayPosts.slice(9);          // Additional list below

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <div className="bg-brand-dark relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop')] opacity-15 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-transparent to-brand-dark" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-brand-orange/15 border border-brand-orange/25 backdrop-blur-md">
                <Rss size={12} className="text-brand-orange animate-pulse" />
                <span className="text-xs font-black text-brand-orange tracking-widest uppercase">The Nexus Journal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 tracking-tight leading-[1.1]">
                Insights, Trends &<br className="hidden md:block" />{" "}
                <span className="text-brand-orange">Expert Picks</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Deep-dive articles, affiliate deals, and industry expertise — curated for smarter decisions.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 shrink-0">
              {[
                { label: "Articles", value: allPosts.length },
                { label: "Categories", value: categories.length },
                { label: "Total Reads", value: allPosts.reduce((s, p) => s + (p.viewCount || 0), 0).toLocaleString() },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-black text-white">{s.value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 -mt-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ════════════════════════════════════
                LEFT — Main feed (70%)
                ════════════════════════════════════ */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Category filter tabs */}
              {categories.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <CategoryFilter categories={categories} totalCount={allPosts.length} />
                </div>
              )}

              {displayPosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <FolderOpen size={36} className="text-gray-200 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No posts in this category yet</h3>
                  <p className="text-gray-500 mb-4">Check back soon or browse all articles.</p>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:underline">
                    ← View all posts
                  </Link>
                </div>
              ) : (
                <>
                  {/* ── HERO FEATURED POST ── */}
                  {featured && (
                    <article className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                      <Link href={`/blog/${featured.slug}`} className="block">
                        {/* Full-bleed image */}
                        <div className="relative w-full aspect-[21/9] overflow-hidden bg-gray-100">
                          {featured.featuredImage ? (
                            <Image src={featured.featuredImage} alt={featured.title} fill priority
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
                              className="object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-800 flex items-center justify-center">
                              <span className="font-black text-8xl text-brand-orange/20">{featured.title.charAt(0)}</span>
                            </div>
                          )}
                          {/* Cinematic gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Badge */}
                          <div className="absolute top-5 left-5 flex items-center gap-2">
                            <span className="bg-brand-orange text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                              <Sparkles size={11} /> Featured
                            </span>
                            {featured.category && (
                              <span className="bg-white/15 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                                {featured.category}
                              </span>
                            )}
                          </div>

                          {/* Overlaid text on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                              <span>{formatDate(featured.publishedAt)}</span>
                              <span className="text-white/30">·</span>
                              <span className="flex items-center gap-1"><Clock size={11} /> {getReadingTime(featured.content)} min read</span>
                              {featured.viewCount > 0 && (
                                <>
                                  <span className="text-white/30">·</span>
                                  <span className="flex items-center gap-1"><Eye size={11} /> {featured.viewCount.toLocaleString()} views</span>
                                </>
                              )}
                              {featured.author && (
                                <>
                                  <span className="text-white/30">·</span>
                                  <span>By {featured.author}</span>
                                </>
                              )}
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-brand-orange transition-colors duration-300 max-w-3xl">
                              {featured.title}
                            </h2>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-2 mb-5">
                              {featured.excerpt || featured.content.replace(/<[^>]*>?/gm, "").substring(0, 200) + "…"}
                            </p>
                            <span className="inline-flex items-center gap-2 text-sm font-black text-brand-orange group-hover:text-orange-400 transition-colors">
                              Read the full story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Tags row */}
                      {featured.tags && (
                        <div className="px-7 py-4 flex flex-wrap gap-1.5 border-t border-gray-50">
                          {featured.tags.split(",").map((t: string) => t.trim()).filter(Boolean).map((tag: string) => (
                            <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                              <Tag size={8} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  )}

                  {/* ── SECONDARY WIDE CARDS (2 per row) ── */}
                  {secondary.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {secondary.map(post => <PostCardWide key={post.id} post={post} />)}
                    </div>
                  )}

                  {/* ── AFFILIATE BANNER (between sections) ── */}
                  <AffiliateBanner position="blog_post" layout="horizontal" />

                  {/* ── 3-COLUMN GRID ── */}
                  {gridPosts.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <span className="w-1 h-5 bg-brand-orange rounded-full" />
                          Latest Articles
                        </h2>
                        {category && (
                          <Link href="/blog" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                            View all <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridPosts.map(post => <PostCard key={post.id} post={post} />)}
                      </div>
                    </>
                  )}

                  {/* ── ADDITIONAL LIST (beyond first 9) ── */}
                  {morePosts.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-5 bg-brand-orange rounded-full" />
                        <h2 className="text-lg font-black text-gray-900">More Articles</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {morePosts.map(post => <PostCardWide key={post.id} post={post} />)}
                      </div>
                    </div>
                  )}

                  {/* ── BOTTOM AFFILIATE BANNER ── */}
                  <AffiliateBanner position="blog" layout="horizontal" />
                </>
              )}
            </div>

            {/* ════════════════════════════════════
                RIGHT — Sidebar (30%)
                ════════════════════════════════════ */}
            <BlogSidebar />

          </div>
        </div>
      </main>

    </div>
  );
}
