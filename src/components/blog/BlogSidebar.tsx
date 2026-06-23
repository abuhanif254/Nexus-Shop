import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Mail, ChevronRight } from "lucide-react";

export default async function BlogSidebar() {
  // Fetch 3 most recent posts for the widget
  const recentPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  const categories = [
    { name: 'Technology', count: 12 },
    { name: 'Fashion', count: 8 },
    { name: 'Tips & Tricks', count: 15 },
    { name: 'Industry News', count: 5 },
  ];

  return (
    <aside className="w-full lg:w-[30%] flex flex-col gap-12 sticky top-24 self-start">
      
      {/* SECTION 1: Categories */}
      <div className="pb-8 border-b border-gray-200">
        <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
          Categories
        </h3>
        <ul className="flex flex-col gap-1">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={`/blog?category=${encodeURIComponent(category.name)}`} className="flex items-center justify-between group py-2.5">
                <span className="text-gray-600 font-medium group-hover:text-brand-orange transition-colors">
                  {category.name}
                </span>
                <span className="text-gray-400 text-xs font-bold bg-gray-100 px-2.5 py-0.5 rounded-full group-hover:bg-orange-100 group-hover:text-brand-orange transition-colors">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* SECTION 2: Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="pb-8 border-b border-gray-200">
          <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
            Latest Reading
          </h3>
          <div className="flex flex-col gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 group items-start">
                <div className="w-16 h-16 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0 mt-1">
                  {post.featuredImage ? (
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-orange font-bold text-lg">{post.title.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-start">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors mb-1.5 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {post.publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt)) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Newsletter CTA */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
        <Mail className="w-8 h-8 text-brand-orange mx-auto mb-4" />
        <h3 className="text-lg font-black text-gray-900 mb-2">The Nexus Journal</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Get the latest industry insights delivered directly to your inbox.
        </p>
        <form className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            required
          />
          <button type="submit" className="w-full py-3 bg-brand-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">
            Subscribe
          </button>
        </form>
      </div>

    </aside>
  );
}
