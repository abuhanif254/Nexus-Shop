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
    title: `${categoryTitle} Products | Besa Shop`,
    description: `Browse our extensive collection of ${categoryTitle.toLowerCase()}. Find the best deals and premium quality products at Besa Shop.`,
    openGraph: {
      title: `${categoryTitle} | Besa Shop`,
      description: `Browse our extensive collection of ${categoryTitle.toLowerCase()}.`,
      url: `https://besa-ecommerce.com/category/${slug}`,
      siteName: 'Besa Electronics',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
