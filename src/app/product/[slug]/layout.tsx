import { Metadata } from 'next';
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const productTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  try {
    // Attempt to find the product in DB
    const allProducts = await db.select().from(products);
    const product = allProducts.find((p: any) => p.title.toLowerCase().replace(/ /g, '-') === slug);

    if (product) {
      const description = `Buy ${product.title} by ${product.brand} for $${product.price}. Enjoy premium quality and fast delivery.`;
      const imageUrl = product.image.startsWith('http') ? product.image : `https://besa-ecommerce.com${product.image.startsWith('/') ? product.image : `/${product.image}.jpg`}`;

      return {
        title: `${product.title} | Besa Shop`,
        description,
        openGraph: {
          title: product.title,
          description,
          url: `https://besa-ecommerce.com/product/${slug}`,
          siteName: 'Besa Electronics',
          images: [
            {
              url: imageUrl,
              width: 800,
              height: 600,
              alt: product.title,
            },
          ],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: product.title,
          description,
          images: [imageUrl],
        },
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata", error);
  }

  // Fallback if product not found or DB fails
  return {
    title: `${productTitle} | Besa Shop`,
    description: `Discover the best deals on ${productTitle} at Besa.`,
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
