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
    <aside className="w-full lg:w-[30%] flex flex-col gap-8">
      
      {/* SECTION 1: Categories */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-brand-orange rounded-full"></span>
          Categories
        </h3>
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={`/blog?category=${encodeURIComponent(category.name)}`} className="flex items-center justify-between group py-2">
                <span className="text-gray-600 font-medium group-hover:text-brand-orange transition-colors flex items-center gap-2">
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                  {category.name}
                </span>
                <span className="bg-gray-50 text-gray-500 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* SECTION 2: Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-orange rounded-full"></span>
            Recent Posts
          </h3>
          <div className="flex flex-col gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                <div className="w-20 h-20 rounded-xl bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {post.featuredImage ? (
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-orange font-bold">{post.title.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors mb-2 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {post.publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt)) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Newsletter CTA */}
      <div className="bg-brand-dark rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange opacity-20 blur-[50px] rounded-full"></div>
        <div className="relative z-10">
          <Mail className="w-10 h-10 text-brand-orange mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-3">Stay Updated</h3>
          <p className="text-gray-300 text-sm mb-6">
            Subscribe to our newsletter for the latest trends and articles.
          </p>
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              required
            />
            <button type="submit" className="w-full py-3 bg-brand-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

    </aside>
  );
}
