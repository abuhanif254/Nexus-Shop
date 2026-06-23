import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const categoryTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${categoryTitle} Products | Nexus Shop`,
    description: `Browse our extensive collection of ${categoryTitle.toLowerCase()}. Find the best deals and premium quality products at Nexus Shop.`,
    openGraph: {
      title: `${categoryTitle} | Nexus Shop`,
      description: `Browse our extensive collection of ${categoryTitle.toLowerCase()}. Find the best deals and premium quality products.`,
      url: `https://www.saheragroup.com/category/${slug}`,
      siteName: 'Nexus Shop',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
