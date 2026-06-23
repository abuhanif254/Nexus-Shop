import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { like, or, and, gte, lte, gt, eq, desc, asc, SQL, sql } from "drizzle-orm";

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
    const inStock = searchParams.get('inStock');
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

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
    if (inStock === 'true') conditions.push(gt(products.totalStock, 0));

    // 1. Get total count for pagination
    let countQueryBuilder: any = db.select({ count: sql<number>`count(*)` }).from(products);
    if (conditions.length > 0) {
      countQueryBuilder = countQueryBuilder.where(and(...conditions));
    }
    const countResult = await countQueryBuilder;
    const total = Number(countResult[0].count);
    const totalPages = Math.ceil(total / limit);

    // 2. Get paginated results
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

    queryBuilder = queryBuilder.limit(limit).offset(offset);

    const results = await queryBuilder;

    return NextResponse.json({ 
      success: true, 
      data: results, 
      results, // kept for backwards compatibility with header search
      pagination: { total, page, limit, totalPages }
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 });
  }
}
