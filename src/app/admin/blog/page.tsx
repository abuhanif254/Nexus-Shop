"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Edit, Trash2, Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="text-brand-orange" /> Blog Manager
        </h1>
        <Link href="/admin/blog/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold w-2/5">Post</th>
                <th className="p-4 font-semibold w-1/5">Status</th>
                <th className="p-4 font-semibold w-1/5">Date</th>
                <th className="p-4 font-semibold w-1/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading posts...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No blog posts found. Write your first post!</td></tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <div className="w-12 h-12 rounded bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${post.isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {post.isPublished ? <><Check size={12}/> Published</> : <><X size={12}/> Draft</>}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.createdAt))}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.isPublished && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors" title="View Public Post">
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <Link href={`/admin/blog/${post.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
