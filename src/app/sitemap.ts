import { MetadataRoute } from 'next';
import { db } from "@/db";
import { products, posts } from "@/db/schema";
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.shop.nexuscalculator.net';

  // Fetch dynamic data
  let allProducts: any[] = [];
  let allCategories: any[] = [];
  let allPosts: any[] = [];
  
  try {
    // Fetch Products & Categories
    allProducts = await db.select().from(products);
    const categorySet = new Set(allProducts.map(p => p.category));
    allCategories = Array.from(categorySet).map(c => ({ slug: (c || '').toLowerCase().replace(/ /g, '-') }));

    // Fetch Published Blog Posts
    allPosts = await db.select()
      .from(posts)
      .where(eq(posts.isPublished, true));
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
  }

  // 1. Dynamic Products
  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/product/${product.title.toLowerCase().replace(/ /g, '-')}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 2. Dynamic Product Categories
  const categoryUrls = allCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Dynamic Blog Posts
  const postUrls = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 4. Core Static Pages
  const staticPages = [
    { url: `${baseUrl}`, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/shipping`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/returns`, changeFrequency: 'monthly' as const, priority: 0.5 },
  ].map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [
    ...staticPages,
    ...categoryUrls,
    ...productUrls,
    ...postUrls,
  ];
}
