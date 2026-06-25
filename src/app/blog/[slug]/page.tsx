import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and, not, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Clock, Tag, FolderOpen, Eye, Share2,
  ArrowRight, Calendar, BookOpen
} from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import ReadingProgress from "@/components/blog/ReadingProgress";
import AffiliateBanner from "@/components/ui/AffiliateBanner";
import ViewCounter from "@/components/blog/ViewCounter";
import TableOfContents from "@/components/blog/TableOfContents";
import CopyLinkButton from "@/components/blog/CopyLinkButton";

export const dynamic = "force-dynamic";

function getReadingTime(content: string) {
  const text = content.replace(/<[^>]*>?/gm, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(date: Date | null, style: "long" | "medium" = "long") {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!data.length) return { title: "Not Found" };

  const post = data[0];
  const siteUrl = "https://www.shop.nexuscalculator.net";

  return {
    title: post.seoTitle || `${post.title} | Nexus Shop Blog`,
    description: post.seoDescription || post.excerpt || post.content.replace(/<[^>]*>?/gm, "").substring(0, 160),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

  if (!data.length || !data[0].isPublished) notFound();

  const post = data[0];
  const readingTime = getReadingTime(post.content);
  const siteUrl = "https://www.shop.nexuscalculator.net";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Related: prefer same category, fall back to latest
  const related = await db
    .select()
    .from(posts)
    .where(and(eq(posts.isPublished, true), not(eq(posts.id, post.id))))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    url: postUrl,
    author: [{
      "@type": post.author ? "Person" : "Organization",
      name: post.author || "Nexus Shop",
      url: siteUrl,
    }],
    publisher: {
      "@type": "Organization",
      name: "Nexus Shop",
      url: siteUrl,
    },
    ...(post.tags && { keywords: post.tags }),
    ...(post.category && { articleSection: post.category }),
    wordCount: post.content.replace(/<[^>]*>?/gm, "").split(/\s+/).filter(Boolean).length,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Thin reading-progress bar at top */}
      <ReadingProgress />
      {/* Silent view counter */}
      <ViewCounter slug={post.slug} />
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ──────────────────────────────────────────
          HERO — cinematic full-width header
      ────────────────────────────────────────── */}
      <header className="relative bg-brand-dark overflow-hidden">
        {/* Background image */}
        {post.featuredImage && (
          <>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-dark/30" />
          </>
        )}

        {/* Dot grid overlay */}
        {!post.featuredImage && (
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-orange text-xs font-bold uppercase tracking-widest mb-10 transition-colors group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> The Nexus Journal
          </Link>

          {/* Category + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.category && (
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-black text-brand-orange bg-brand-orange/15 border border-brand-orange/25 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-brand-orange/25 transition-colors"
              >
                <FolderOpen size={10} /> {post.category}
              </Link>
            )}
            {post.tags && post.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white/8 border border-white/15 px-2.5 py-0.5 rounded-full">
                <Tag size={8} /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-8">{post.excerpt}</p>
          )}

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-white text-[10px] font-black">
                  {post.author.charAt(0).toUpperCase()}
                </span>
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-gray-500" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 text-brand-orange">
              <Clock size={11} /> {readingTime} min read
            </span>
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye size={11} className="text-gray-500" /> {post.viewCount.toLocaleString()} views
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────
          BODY — article + sidebar
      ────────────────────────────────────────── */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

            {/* ══════════════════════════════════════
                LEFT — Article (70%)
                ══════════════════════════════════════ */}
            <article className="flex-1 min-w-0">

              {/* ── TABLE OF CONTENTS ── */}
              <TableOfContents />

              {/* ── PROSE CONTENT ── */}
              <div
                className="
                  bg-white rounded-3xl shadow-sm border border-gray-100 p-7 sm:p-10 md:p-12 mb-8
                  prose prose-lg md:prose-xl max-w-none
                  prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:mb-5
                  prose-a:text-brand-orange prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-black
                  prose-em:text-gray-700
                  prose-ul:text-gray-600 prose-ol:text-gray-600
                  prose-li:my-1.5 prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-brand-orange
                  prose-blockquote:bg-orange-50 prose-blockquote:px-8 prose-blockquote:py-5
                  prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
                  prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-blockquote:shadow-sm
                  prose-code:text-brand-orange prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:shadow-xl
                  prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto
                  prose-hr:border-gray-100 prose-hr:my-10
                  prose-table:text-sm
                  prose-th:bg-gray-50 prose-th:font-black prose-th:text-gray-900
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* ── MID-ARTICLE AFFILIATE BANNER ── */}
              <div className="mb-8">
                <AffiliateBanner position="blog_post" layout="horizontal" />
              </div>

              {/* ── AUTHOR BIO CARD ── */}
              {post.author && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-400 flex items-center justify-center text-white font-black text-2xl shrink-0">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Written by</p>
                    <p className="text-lg font-black text-gray-900 mb-1">{post.author}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Expert contributor at The Nexus Journal — sharing insights on affiliate marketing, technology, and lifestyle.
                    </p>
                  </div>
                </div>
              )}

              {/* ── TAGS FOOTER ── */}
              {post.tags && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-8 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tags:</span>
                  {post.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors cursor-default">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── SOCIAL SHARE ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
                    <Share2 size={15} className="text-brand-orange" /> Share this article
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                      target="_blank" rel="noreferrer"
                      className="w-11 h-11 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all"
                      title="Share on Twitter"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                      target="_blank" rel="noreferrer"
                      className="w-11 h-11 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all"
                      title="Share on Facebook"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                      target="_blank" rel="noreferrer"
                      className="w-11 h-11 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all"
                      title="Share on LinkedIn"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    {/* Copy link */}
                    <CopyLinkButton url={postUrl} />
                  </div>
                </div>
              </div>

              {/* ── RELATED POSTS ── */}
              {related.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-1 h-6 bg-brand-orange rounded-full" />
                    <h2 className="text-xl font-black text-gray-900">Read Next</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {related.map((rp) => {
                      const rt = getReadingTime(rp.content);
                      return (
                        <Link
                          key={rp.id}
                          href={`/blog/${rp.slug}`}
                          className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                            {rp.featuredImage ? (
                              <Image src={rp.featuredImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-brand-orange/10 to-orange-50 flex items-center justify-center">
                                <span className="font-black text-3xl text-brand-orange/30">{rp.title.charAt(0)}</span>
                              </div>
                            )}
                            {rp.category && (
                              <span className="absolute top-2 left-2 bg-white/90 text-brand-orange text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                {rp.category}
                              </span>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                              <span>{formatDate(rp.publishedAt, "medium")}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1"><Clock size={9} /> {rt}m</span>
                            </div>
                            <h3 className="text-sm font-black text-gray-900 line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug flex-1 mb-3">
                              {rp.title}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-xs font-black text-brand-orange">
                              Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </article>

            {/* ══════════════════════════════════════
                RIGHT — Sidebar (30%)
                ══════════════════════════════════════ */}
            <BlogSidebar />

          </div>
        </div>
      </main>
    </div>
  );
}
