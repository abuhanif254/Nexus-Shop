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
      const imageUrl = product.image.startsWith('http') ? product.image : `https://www.saheragroup.com${product.image.startsWith('/') ? product.image : `/${product.image}.jpg`}`;

      return {
        title: `${product.title} | Nexus Shop`,
        description: (product.description || "").substring(0, 160),
        openGraph: {
          title: product.title,
          description,
          url: `https://www.saheragroup.com/product/${slug}`,
          siteName: 'Nexus Shop',
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
    title: `${productTitle} | Nexus Shop`,
    description: `Discover the best deals on ${productTitle} at Nexus Shop.`,
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  
  let productSchema = null;
  let breadcrumbSchema = null;
  try {
    const allProducts = await db.select().from(products);
    const product = allProducts.find((p: any) => p.title.toLowerCase().replace(/ /g, '-') === slug);
    if (product) {
      const imageUrl = product.image.startsWith('http') ? product.image : `https://www.saheragroup.com${product.image.startsWith('/') ? product.image : `/${product.image}.jpg`}`;
      
      productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": imageUrl,
        "description": product.description,
        "sku": product.id.toString(),
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.saheragroup.com/product/${slug}`,
          "priceCurrency": "USD",
          "price": product.price,
          "availability": product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviews || 1
        }
      };

      breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.saheragroup.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Shop",
            "item": "https://www.saheragroup.com/shop"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.title,
            "item": `https://www.saheragroup.com/product/${slug}`
          }
        ]
      };
    }
  } catch (e) {}

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
