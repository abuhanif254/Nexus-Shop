import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, eq, gte, lte, gt, desc, asc, SQL, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if category exists
    const categoryRecord = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    const categoryName = categoryRecord.length > 0 ? categoryRecord[0].name : slug;

    const { searchParams } = new URL(request.url);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort');
    const inStock = searchParams.get('inStock');
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    // Filter by the requested category slug or name. Since categories can have a display name and a slug,
    // we match against the slug. However, if the product stores the category name, we should check against that.
    // In our DB schema, product.category probably stores the slug or the name. Let's filter by slug or name.
    conditions.push(
      sql`LOWER(${products.category}) = LOWER(${slug}) OR LOWER(${products.category}) = LOWER(${categoryName})`
    );

    if (minPrice) conditions.push(gte(products.price, parseFloat(minPrice)));
    if (maxPrice) conditions.push(lte(products.price, parseFloat(maxPrice)));
    if (brand) conditions.push(eq(products.brand, brand));
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
      category: categoryName,
      pagination: { total, page, limit, totalPages }
    });
  } catch (error) {
    console.error("Category API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch category products" }, { status: 500 });
  }
}
