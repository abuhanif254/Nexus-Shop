import { MetadataRoute } from 'next';
import { db } from "@/db";
import { products, posts, categories } from "@/db/schema";
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://www.shop.nexuscalculator.net';

const slugify = (text: string) =>
  text?.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') ?? '';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Fetch all dynamic data in parallel ──
  let allProducts: any[] = [];
  let allCategories: any[] = [];
  let allPosts: any[] = [];

  try {
    [allProducts, allCategories, allPosts] = await Promise.all([
      db.select().from(products),
      db.select().from(categories),
      db.select().from(posts).where(eq(posts.isPublished, true)),
    ]);

    // Merge implicit categories from products (not already in categories table)
    const dbCategorySlugs = new Set(allCategories.map((c: any) => c.slug));
    allProducts.forEach((p: any) => {
      if (p.category) {
        const slug = slugify(p.category);
        if (!dbCategorySlugs.has(slug)) {
          allCategories.push({ slug });
          dbCategorySlugs.add(slug);
        }
      }
    });
  } catch (err) {
    console.error('[sitemap] DB error:', err);
  }

  // ── 1. Core static pages (highest priority) ──
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,              changeFrequency: 'daily',   priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/blog`,    changeFrequency: 'daily',   priority: 0.95, lastModified: new Date() },
    { url: `${BASE_URL}/shop`,    changeFrequency: 'daily',   priority: 0.9,  lastModified: new Date() },
    { url: `${BASE_URL}/about`,   changeFrequency: 'monthly', priority: 0.6,  lastModified: new Date() },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6,  lastModified: new Date() },
    { url: `${BASE_URL}/faq`,     changeFrequency: 'monthly', priority: 0.5,  lastModified: new Date() },
    { url: `${BASE_URL}/terms`,   changeFrequency: 'yearly',  priority: 0.3,  lastModified: new Date() },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly',  priority: 0.3,  lastModified: new Date() },
    { url: `${BASE_URL}/shipping`,changeFrequency: 'monthly', priority: 0.4,  lastModified: new Date() },
    { url: `${BASE_URL}/returns`, changeFrequency: 'monthly', priority: 0.4,  lastModified: new Date() },
  ];

  // ── 2. Blog posts (priority 0.9 — main content for affiliate SEO) ──
  const postUrls: MetadataRoute.Sitemap = allPosts.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.publishedAt ?? new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    // Next.js doesn't yet support images[] in MetadataRoute.Sitemap natively,
    // but we keep the highest priority so Google re-crawls frequently.
  }));

  // ── 3. Product category pages ──
  const categoryUrls: MetadataRoute.Sitemap = allCategories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ── 4. Product pages ──
  const productUrls: MetadataRoute.Sitemap = allProducts.map((p: any) => ({
    url: `${BASE_URL}/product/${slugify(p.title)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // Order: static → blog posts → categories → products
  return [
    ...staticPages,
    ...postUrls,
    ...categoryUrls,
    ...productUrls,
  ];
}
