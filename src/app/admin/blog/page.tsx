"use client";

import { useState, useEffect } from "react";
import {
  FileText, Plus, Edit2, Trash2, Globe, EyeOff,
  ExternalLink, Tag, Eye, BarChart2, Clock, FolderOpen
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  author: string | null;
  category: string | null;
  tags: string | null;
  viewCount: number;
  content: string;
}

function readingTime(html: string) {
  const wc = html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wc / 200));
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    await fetchPosts();
  };

  const togglePublish = async (post: Post) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    await fetchPosts();
  };

  const filtered = posts.filter(p =>
    filterStatus === "all"       ? true :
    filterStatus === "published" ? p.isPublished :
    !p.isPublished
  );

  const publishedCount = posts.filter(p => p.isPublished).length;
  const draftCount = posts.filter(p => !p.isPublished).length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="text-brand-orange" /> Blog Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">Write, edit, and publish your affiliate articles.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="shrink-0 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-200 text-sm"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Posts",    value: posts.length },
          { label: "Published",      value: publishedCount, color: "text-green-600" },
          { label: "Drafts",         value: draftCount,     color: "text-gray-400" },
          { label: "Total Views",    value: totalViews.toLocaleString(), color: "text-brand-orange" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color ?? "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-2">
        {(["all", "published", "draft"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              filterStatus === f ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? `All (${posts.length})` : f === "published" ? `Published (${publishedCount})` : `Drafts (${draftCount})`}
          </button>
        ))}
      </div>

      {/* ── Posts Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Post</th>
                <th className="p-4">Author / Tags</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-center">Read</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No posts found.</p>
                    <Link href="/admin/blog/new" className="mt-3 inline-block text-brand-orange text-sm font-bold hover:underline">
                      + Write your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map(post => (
                  <tr key={post.id} className={`hover:bg-gray-50/50 transition-colors ${!post.isPublished ? "opacity-60" : ""}`}>

                    {/* Post info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-brand-orange font-black text-xl">
                            {post.title.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 text-sm line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-400 font-mono line-clamp-1 mt-0.5">/blog/{post.slug}</p>
                          {post.category && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                              <FolderOpen size={8} /> {post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Author / tags */}
                    <td className="p-4">
                      {post.author && (
                        <p className="text-xs font-bold text-gray-700 mb-1.5">By {post.author}</p>
                      )}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 3).map(t => (
                            <span key={t} className="inline-flex items-center gap-0.5 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              <Tag size={8} /> {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {!post.author && !post.tags && (
                        <span className="text-xs text-gray-300 italic">No meta</span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 text-sm font-black text-gray-700">
                        <Eye size={13} className="text-gray-400" />
                        {(post.viewCount || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Reading time */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-500">
                        <Clock size={11} />
                        {readingTime(post.content)}m
                      </div>
                    </td>

                    {/* Status toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => togglePublish(post)}
                        title={post.isPublished ? "Click to unpublish" : "Click to publish"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                          post.isPublished
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        }`}
                      >
                        {post.isPublished ? <Globe size={10} /> : <EyeOff size={10} />}
                        {post.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {post.isPublished && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                            title="View public post"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit post"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
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
