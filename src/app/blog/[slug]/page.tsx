import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and, not, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Link2, Mail } from "lucide-react";

export const dynamic = 'force-dynamic';

function getReadingTime(content: string) {
  const text = content.replace(/<[^>]*>?/gm, '');
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!data.length) return { title: 'Not Found' };
  
  return {
    title: `${data[0].title} | Nexus Shop Blog`,
    description: data[0].excerpt || data[0].content.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  
  if (!data.length || !data[0].isPublished) {
    notFound();
  }

  const post = data[0];
  const readingTime = getReadingTime(post.content);

  // Fetch related posts (Step 8)
  const relatedPosts = await db.select()
    .from(posts)
    .where(and(eq(posts.isPublished, true), not(eq(posts.id, post.id))))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  // Structured Data (Step 9)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: [{
      '@type': 'Organization',
      name: 'Nexus Shop',
      url: 'https://nexus-shop.com'
    }]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Step 9: Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pb-24">
        {post.featuredImage && (
          <div className="w-full h-[50vh] md:h-[60vh] relative bg-brand-dark">
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill 
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        )}

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 -mt-20 md:-mt-32">
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-16 mb-12">
            {!post.featuredImage && (
              <Link href="/blog" className="inline-flex items-center text-brand-orange hover:text-orange-600 mb-8 font-bold transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to all articles
              </Link>
            )}

            <header className="mb-12 text-center border-b border-gray-100 pb-12">
              <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">
                <span>
                  {post.publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt)) : ''}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5 text-brand-orange">
                  <Clock size={16} /> {readingTime} MIN READ
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                {post.title}
              </h1>
            </header>

            <div 
              className="prose prose-lg md:prose-xl prose-orange max-w-none prose-img:rounded-2xl prose-a:text-brand-orange prose-a:font-bold prose-headings:font-black prose-p:leading-relaxed prose-p:text-gray-600 mx-auto"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Step 7: Social Sharing */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="font-bold text-gray-900">Share this article:</div>
              <div className="flex items-center gap-3">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <button className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all">
                  <Link2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Step 10: Newsletter CTA */}
          <div className="bg-brand-dark rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-20 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Mail className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">Never miss an update</h3>
              <p className="text-gray-300 mb-8 text-lg">
                Join our newsletter to receive the latest articles, industry trends, and exclusive offers directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                <button type="submit" className="px-8 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Step 8: Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Read Next</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {rp.featuredImage ? (
                        <Image src={rp.featuredImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-orange font-bold text-2xl">{rp.title.charAt(0)}</div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
                        {rp.publishedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(rp.publishedAt)) : ''}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {rp.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
