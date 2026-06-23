import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { products } from './schema';
import crypto from 'crypto';

// Initialize DB explicitly for the script
const db = drizzle(sql, { schema: { products } });

async function seed() {
  console.log('🌱 Starting database seed...');
  
  const dummyProducts = [
    {
      id: crypto.randomUUID(),
      title: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      category: 'Electronic Devices',
      price: 348.00,
      oldPrice: 399.99,
      discount: 13,
      rating: 4.8,
      reviews: 1245,
      soldCount: 5000,
      totalStock: 120,
      vendor: 'Sony Official Store',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Apple MacBook Pro 16" M3 Max',
      brand: 'Apple',
      category: 'Electronic Devices',
      price: 3499.00,
      oldPrice: null,
      discount: 0,
      rating: 4.9,
      reviews: 890,
      soldCount: 2100,
      totalStock: 45,
      vendor: 'Apple Inc.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Samsung Galaxy S24 Ultra 5G',
      brand: 'Samsung',
      category: 'Electronic Devices',
      price: 1299.00,
      oldPrice: 1399.00,
      discount: 7,
      rating: 4.7,
      reviews: 3200,
      soldCount: 15000,
      totalStock: 300,
      vendor: 'Samsung Official',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'LG C3 65-inch OLED 4K Smart TV',
      brand: 'LG',
      category: 'TV & Home Appliances',
      price: 1599.99,
      oldPrice: 1999.99,
      discount: 20,
      rating: 4.8,
      reviews: 450,
      soldCount: 1200,
      totalStock: 25,
      vendor: 'LG Electronics',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Dyson V15 Detect Absolute Vacuum',
      brand: 'Dyson',
      category: 'Home & Kitchen',
      price: 749.99,
      oldPrice: null,
      discount: 0,
      rating: 4.6,
      reviews: 890,
      soldCount: 3400,
      totalStock: 80,
      vendor: 'Dyson Official',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Nintendo Switch OLED Model',
      brand: 'Nintendo',
      category: 'Electronic Devices',
      price: 349.99,
      oldPrice: 399.99,
      discount: 12,
      rating: 4.9,
      reviews: 5600,
      soldCount: 45000,
      totalStock: 500,
      vendor: 'Nintendo Store',
      image: 'https://images.unsplash.com/photo-1578281313437-b45d0505f560?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Logitech MX Master 3S Wireless Mouse',
      brand: 'Logitech',
      category: 'Electronic Accessories',
      price: 99.99,
      oldPrice: 119.99,
      discount: 16,
      rating: 4.8,
      reviews: 2100,
      soldCount: 8900,
      totalStock: 150,
      vendor: 'Logitech',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Keychron Q1 Pro Mechanical Keyboard',
      brand: 'Keychron',
      category: 'Electronic Accessories',
      price: 199.00,
      oldPrice: null,
      discount: 0,
      rating: 4.7,
      reviews: 430,
      soldCount: 1500,
      totalStock: 60,
      vendor: 'Keychron',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Bose QuietComfort Earbuds II',
      brand: 'Bose',
      category: 'Electronic Devices',
      price: 279.00,
      oldPrice: 299.00,
      discount: 6,
      rating: 4.6,
      reviews: 1200,
      soldCount: 4200,
      totalStock: 90,
      vendor: 'Bose',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aec8c36430?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Sony PlayStation 5 Console',
      brand: 'Sony',
      category: 'Electronic Devices',
      price: 499.99,
      oldPrice: null,
      discount: 0,
      rating: 4.9,
      reviews: 15000,
      soldCount: 80000,
      totalStock: 0,
      vendor: 'Sony PlayStation',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Apple Watch Series 9 GPS 45mm',
      brand: 'Apple',
      category: 'Electronic Devices',
      price: 429.00,
      oldPrice: null,
      discount: 0,
      rating: 4.8,
      reviews: 3400,
      soldCount: 12000,
      totalStock: 200,
      vendor: 'Apple Inc.',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6cb3be?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Ninja Creami Ice Cream Maker',
      brand: 'Ninja',
      category: 'Home & Kitchen',
      price: 199.99,
      oldPrice: 229.99,
      discount: 13,
      rating: 4.7,
      reviews: 6500,
      soldCount: 20000,
      totalStock: 45,
      vendor: 'Ninja Kitchen',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
      featured: false,
      createdAt: new Date(),
    }
  ];

  try {
    // Clear existing products first
    console.log('🗑️ Clearing existing products...');
    await db.delete(products);

    // Insert new products
    console.log('📦 Inserting mock products...');
    for (const product of dummyProducts) {
      await db.insert(products).values(product);
    }

    console.log(`✅ Successfully seeded ${dummyProducts.length} products to the database!`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
