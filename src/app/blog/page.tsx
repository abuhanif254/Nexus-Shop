import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const publishedPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="min-h-screen flex flex-col">
      {/* DYNAMIC HERO BANNER */}
      <div className="bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/95" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-brand-orange/20 border border-brand-orange/30 backdrop-blur-md">
            <span className="text-sm font-bold text-brand-orange tracking-wider uppercase">
              The Nexus Journal
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Insights, Trends & <br className="hidden md:block" /> Industry Expertise
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the latest news, expert tips, and deep dives into the world of e-commerce, technology, and lifestyle.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-16 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* CATEGORY NAVIGATION (Step 3) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {['All', 'Technology', 'Fashion', 'Tips & Tricks', 'Industry News'].map((category) => (
              <Link 
                key={category}
                href={category === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  category === 'All' 
                    ? 'bg-brand-dark text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {publishedPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">Check back later for exciting new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* FEATURED POST (Step 2) */}
              {publishedPosts.length > 0 && (
                <article className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row group">
                  <Link href={`/blog/${publishedPosts[0].slug}`} className="block relative w-full md:w-1/2 aspect-video md:aspect-auto bg-gray-100 overflow-hidden">
                    {publishedPosts[0].featuredImage ? (
                      <Image 
                        src={publishedPosts[0].featuredImage} 
                        alt={publishedPosts[0].title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="font-semibold text-2xl text-brand-orange">{publishedPosts[0].title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Featured
                    </div>
                  </Link>
                  <div className="p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-brand-orange mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                      {publishedPosts[0].publishedAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(publishedPosts[0].publishedAt)) : 'Recent'}
                    </p>
                    <Link href={`/blog/${publishedPosts[0].slug}`} className="block mb-4">
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 line-clamp-3 group-hover:text-brand-orange transition-colors leading-tight">
                        {publishedPosts[0].title}
                      </h3>
                    </Link>
                    <p className="text-base text-gray-500 line-clamp-3 mb-8 leading-relaxed">
                      {publishedPosts[0].excerpt || publishedPosts[0].content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                    </p>
                    <Link href={`/blog/${publishedPosts[0].slug}`} className="inline-flex items-center text-brand-dark font-bold hover:text-brand-orange transition-colors group/link">
                      Read the full story <span className="ml-2 group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </div>
                </article>
              )}

              {/* REGULAR POSTS */}
              {publishedPosts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {post.featuredImage ? (
                      <Image 
                        src={post.featuredImage} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="font-semibold text-xl text-brand-orange">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {post.publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt)) : ''}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="block mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
