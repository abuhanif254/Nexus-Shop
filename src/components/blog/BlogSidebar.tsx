import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Mail, Clock, Eye, FolderOpen, Rss, ArrowRight } from "lucide-react";
import AffiliateBanner from "@/components/ui/AffiliateBanner";

function getReadingTime(content: string) {
  const wc = content.replace(/<[^>]*>?/gm, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wc / 200));
}

export default async function BlogSidebar() {
  // Fetch recent posts + derive real category counts in one query
  const allPosts = await db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.publishedAt));
  const recentPosts = allPosts.slice(0, 4);

  // Build real category map
  const catMap = new Map<string, number>();
  allPosts.forEach(p => {
    if (p.category) catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
  });
  const categories = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">

      {/* ── AFFILIATE BANNER (position=blog) ── */}
      <AffiliateBanner position="blog" layout="vertical" />

      {/* ── CATEGORIES (real counts from DB) ── */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-900 mb-5 uppercase tracking-widest flex items-center gap-2">
            <FolderOpen size={12} className="text-brand-orange" /> Categories
          </h3>
          <ul className="flex flex-col divide-y divide-gray-50">
            {categories.map(({ name, count }) => (
              <li key={name}>
                <Link
                  href={`/blog?category=${encodeURIComponent(name)}`}
                  className="flex items-center justify-between group py-2.5"
                >
                  <span className="text-sm text-gray-600 font-medium group-hover:text-brand-orange transition-colors">
                    {name}
                  </span>
                  <span className="text-xs font-black text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── RECENT POSTS ── */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-900 mb-5 uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} className="text-brand-orange" /> Latest Reading
          </h3>
          <div className="flex flex-col gap-5">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-3 group items-start">
                {/* Thumb */}
                <div className="w-16 h-16 rounded-xl bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-100">
                  {post.featuredImage ? (
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-orange font-black text-xl bg-gradient-to-br from-orange-50 to-orange-100">
                      {post.title.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  {post.category && (
                    <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest mb-1 block">{post.category}</span>
                  )}
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug mb-1.5">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-0.5"><Clock size={8} /> {getReadingTime(post.content)}m</span>
                    {post.viewCount > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Eye size={8} /> {post.viewCount}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/blog" className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-center gap-1.5 text-xs font-black text-brand-orange hover:text-orange-600 transition-colors">
            View all articles <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* ── NEWSLETTER CTA ── */}
      <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-2xl p-7 text-center relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl" />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Rss className="w-6 h-6 text-brand-orange" />
          </div>
          <h3 className="text-base font-black text-white mb-2">The Nexus Journal</h3>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Get the latest insights & affiliate deals delivered to your inbox.
          </p>
          <form className="flex flex-col gap-2.5">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-700 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              required
            />
            <button type="submit" className="w-full py-3 bg-brand-orange text-white text-sm font-black rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/30">
              Subscribe Free
            </button>
          </form>
        </div>
      </div>

    </aside>
  );
}
