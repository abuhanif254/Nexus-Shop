import { MetadataRoute } from 'next';
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.shop.nexuscalculator.net';

  // Fetch dynamic data
  let allProducts: any[] = [];
  let allCategories: any[] = [];
  
  try {
    allProducts = await db.select().from(products);
    const categorySet = new Set(allProducts.map(p => p.category));
    allCategories = Array.from(categorySet).map(c => ({ slug: (c || '').toLowerCase().replace(/ /g, '-') }));
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
  }

  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/product/${product.title.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = allCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
