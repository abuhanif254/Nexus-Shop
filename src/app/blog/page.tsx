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

          {publishedPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">Check back later for exciting new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video bg-gray-100 overflow-hidden">
                    {post.featuredImage ? (
                      <Image 
                        src={post.featuredImage} 
                        alt={post.title} 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="font-semibold text-lg text-brand-orange">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">
                        {post.publishedAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(post.publishedAt)) : ''}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="block mt-2">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-brand-orange transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center">
                      <Link href={`/blog/${post.slug}`} className="text-brand-orange font-semibold hover:text-orange-600 text-sm">
                        Read full article &rarr;
                      </Link>
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
