
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';



export const dynamic = 'force-dynamic';
const mockProducts = [
  {
    id: '1',
    discount: 27,
    featured: true,
    image: "headphone",
    brand: "Hcetigol",
    title: "Cosmic Byte GS410 Headset with Mic",
    rating: 4.8,
    reviews: 6,
    price: 152.99,
    oldPrice: 209.99,
    vendor: "Abril Copeland",
    soldCount: 9,
    totalStock: 24,
    category: 'Electronics',
    createdAt: new Date(),
  },
  {
    id: '2',
    discount: 35,
    featured: false,
    image: "table",
    brand: "MEO",
    title: "DriftingWood Solid Wood Coffee Table",
    rating: 4.5,
    reviews: 4,
    price: 58.90,
    oldPrice: 89.99,
    vendor: "Scarlett Rivas",
    soldCount: 27,
    totalStock: 50,
    category: 'Furniture',
    createdAt: new Date(),
  },
  {
    id: '3',
    discount: 17,
    featured: false,
    image: "tablet",
    brand: "Elppa",
    title: "Elppa IPad Pro (2018) (Wifi + 3G)",
    rating: 4.2,
    reviews: 4,
    price: 499.90,
    oldPrice: 599.90,
    vendor: "Gia Marquez",
    soldCount: 44,
    totalStock: 101,
    category: 'Electronics',
    createdAt: new Date(),
  },
  {
    id: '4',
    discount: 26,
    featured: false,
    image: "phone",
    brand: "Elgoog",
    title: "Geoglo Pexel 3a XL 2018 Plus",
    rating: 4.6,
    reviews: 4,
    price: 890.90,
    oldPrice: 1209.99,
    vendor: "Gia Marquez",
    soldCount: 41,
    totalStock: 96,
    category: 'Electronics',
    createdAt: new Date(),
  },
  {
    id: '5',
    discount: 33,
    featured: false,
    image: "sofa",
    brand: "ESORMIRP",
    title: "PRIMROSE Eclipse Fabric 3 Seater Sofa",
    rating: 4.0,
    reviews: 3,
    price: 199.90,
    oldPrice: 299.99,
    vendor: "Gia Marquez",
    soldCount: 100,
    totalStock: 169,
    category: 'Furniture',
    createdAt: new Date(),
  },
];

export async function GET(request: Request) {
  try {
    // 1. Fetch from DB
    let allProducts = await db.select().from(productsTable);

    // 2. Seed if empty
    if (allProducts.length === 0) {
      await db.insert(productsTable).values(mockProducts);
      allProducts = await db.select().from(productsTable);
    }

    // 3. Filter by category if requested
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let filteredProducts = allProducts;
    if (category) {
      filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    const response = NextResponse.json({ success: true, data: filteredProducts });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return response;
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

