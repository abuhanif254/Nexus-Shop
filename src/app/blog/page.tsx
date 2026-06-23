import Link from 'next/link';

export const metadata = {
  title: 'Blog | Nexus Shop',
  description: 'Read the latest news, tips, and trends from Nexus Shop.',
};

export default function BlogPage() {
  // Mock blog posts
  const posts = [
    {
      id: 1,
      title: "Top 10 Gadgets You Need in 2026",
      slug: "top-10-gadgets-2026",
      excerpt: "Discover the must-have electronics that are changing the way we live and work.",
      date: "June 20, 2026",
    },
    {
      id: 2,
      title: "How to Build a Smart Home",
      slug: "how-to-build-smart-home",
      excerpt: "A beginner's guide to automating your house with the latest smart devices.",
      date: "June 15, 2026",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Nexus Shop Blog</h1>
        <div className="grid gap-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-brand-orange text-sm font-bold mb-2 block">{post.date}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-brand-orange transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-brand-orange font-semibold hover:underline">Read more →</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
