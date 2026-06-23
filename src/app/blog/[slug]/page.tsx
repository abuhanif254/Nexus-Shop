import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unwrappedParams = await params;
  const title = unwrappedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | Nexus Shop Blog`,
    description: `Read about ${title} on the Nexus Shop Blog.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const date = new Date().toISOString();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": "https://www.saheragroup.com/blog-placeholder.jpg",
    "datePublished": date,
    "dateModified": date,
    "author": {
      "@type": "Organization",
      "name": "Nexus Shop"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nexus Shop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.saheragroup.com/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <article className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="text-brand-orange hover:underline mb-8 inline-block">← Back to Blog</Link>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{title}</h1>
        <div className="text-gray-500 mb-10 border-b border-gray-100 pb-6">Published by Nexus Shop</div>
        <div className="prose prose-lg prose-orange max-w-none text-gray-700 leading-relaxed">
          <p>This is a placeholder for the blog post content. In a real application, this content would be fetched from a CMS like Sanity, Contentful, or your database.</p>
          <p>Having a blog is an excellent way to capture long-tail search traffic and establish topical authority in your e-commerce niche. Make sure to link to relevant products within your articles!</p>
        </div>
      </article>
    </div>
  );
}
