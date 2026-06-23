import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { like, or, and, gte, lte, eq, desc, asc, SQL } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort');

    const conditions: SQL[] = [];

    if (query && query.trim().length > 0) {
      const searchTerm = `%${query}%`;
      conditions.push(
        or(
          like(products.title, searchTerm),
          like(products.brand, searchTerm),
          like(products.category, searchTerm)
        )!
      );
    }
    
    if (minPrice) conditions.push(gte(products.price, parseFloat(minPrice)));
    if (maxPrice) conditions.push(lte(products.price, parseFloat(maxPrice)));
    if (brand) conditions.push(eq(products.brand, brand));
    if (category) conditions.push(eq(products.category, category));
    if (rating) conditions.push(gte(products.rating, parseFloat(rating)));

    let queryBuilder: any = db.select().from(products);
    
    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    if (sort === 'price_asc') {
      queryBuilder = queryBuilder.orderBy(asc(products.price));
    } else if (sort === 'price_desc') {
      queryBuilder = queryBuilder.orderBy(desc(products.price));
    } else if (sort === 'newest') {
      queryBuilder = queryBuilder.orderBy(desc(products.createdAt));
    } else if (sort === 'popular') {
      queryBuilder = queryBuilder.orderBy(desc(products.soldCount));
    }

    const results = await queryBuilder;

    // Return both 'results' (for backwards autocomplete) and 'data' (for ProductGrid)
    return NextResponse.json({ success: true, data: results, results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 });
  }
}
