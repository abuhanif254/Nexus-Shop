import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const publishedPosts = await db.select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Blog</h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Latest news, tips, and articles.
            </p>
          </div>

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

      <Footer />
    </div>
  );
}
