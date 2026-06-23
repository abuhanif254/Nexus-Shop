import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-16">
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
          </div>
        </article>
      </main>
    </div>
  );
}
