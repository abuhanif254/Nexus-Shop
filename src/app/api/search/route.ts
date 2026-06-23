
import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { like, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query}%`;

    const results = await db.select({
      id: products.id,
      title: products.title,
      price: products.price,
      image: products.image,
      category: products.category,
      brand: products.brand,
    })
    .from(products)
    .where(
      or(
        like(products.title, searchTerm),
        like(products.brand, searchTerm),
        like(products.category, searchTerm)
      )
    )
    .limit(5); // Only return top 5 results for autocomplete

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}

