// Cloudflare Edge runtime


// Mock data spanning different categories
const allProducts = [
  { id: 1, discount: 27, featured: true, image: "headphone", brand: "Sony", title: "WH-1000XM5 Wireless Headphones", rating: 4.8, reviews: 124, price: 348.00, oldPrice: 399.99, vendor: "TechStore", soldCount: 450, totalStock: 500, category: 'electronics' },
  { id: 2, discount: 15, featured: false, image: "tablet", brand: "Apple", title: "iPad Pro 11-inch (M2)", rating: 4.9, reviews: 342, price: 799.00, oldPrice: 899.00, vendor: "AppleDirect", soldCount: 890, totalStock: 1000, category: 'electronics' },
  { id: 3, discount: 0, featured: false, image: "phone", brand: "Samsung", title: "Galaxy S24 Ultra 256GB", rating: 4.7, reviews: 89, price: 1299.00, oldPrice: 1299.00, vendor: "SamsungOutlet", soldCount: 120, totalStock: 200, category: 'electronics' },
  { id: 4, discount: 40, featured: true, image: "sofa", brand: "IKEA", title: "KIVIK 3-seat Sofa", rating: 4.5, reviews: 56, price: 399.00, oldPrice: 665.00, vendor: "HomeGoods", soldCount: 45, totalStock: 60, category: 'home' },
  { id: 5, discount: 20, featured: false, image: "table", brand: "Wayfair", title: "Solid Wood Dining Table", rating: 4.2, reviews: 23, price: 299.00, oldPrice: 375.00, vendor: "FurnishNow", soldCount: 12, totalStock: 30, category: 'home' },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Extract search params for filtering (Step 6 preparation)
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort');
  const brand = searchParams.get('brand');
  
  // Filter by category slug
  let filteredProducts = allProducts.filter(p => p.category.toLowerCase() === slug.toLowerCase());
  
  // Mock brand filtering
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Mock sorting
  if (sort === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Simulate network delay for realistic loading states
  await new Promise(resolve => setTimeout(resolve, 600));

  return new Response(
    JSON.stringify({
      success: true,
      category: slug,
      total: filteredProducts.length,
      data: filteredProducts
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' // Edge caching
      }
    }
  );
}
