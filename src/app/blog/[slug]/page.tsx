import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await db.select().from(posts).where(eq(posts.slug, params.slug)).limit(1);
  if (!data.length) return { title: 'Not Found' };
  
  return {
    title: `${data[0].title} | Nexus Shop Blog`,
    description: data[0].excerpt || data[0].content.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const data = await db.select().from(posts).where(eq(posts.slug, params.slug)).limit(1);
  
  if (!data.length || !data[0].isPublished) {
    notFound();
  }

  const post = data[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pb-16">
        {post.featuredImage && (
          <div className="w-full h-[40vh] md:h-[50vh] relative bg-gray-100">
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {!post.featuredImage && (
            <Link href="/blog" className="inline-flex items-center text-brand-orange hover:underline mb-8 font-medium">
              <ArrowLeft size={16} className="mr-2" /> Back to blog
            </Link>
          )}

          <header className="mb-10 text-center">
            <p className="text-gray-500 font-medium mb-3">
              {post.publishedAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(post.publishedAt)) : ''}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>
          </header>

          <div 
            className="prose prose-lg prose-orange max-w-none prose-img:rounded-xl prose-a:text-brand-orange"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
