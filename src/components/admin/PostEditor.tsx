"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Save, ArrowLeft, Eye, EyeOff, Globe, Tag, User,
  FolderOpen, Search, ImageIcon, AlignLeft, ChevronDown,
  ChevronUp, CheckCircle, Loader2, ExternalLink
} from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-50 rounded-xl border border-gray-200 animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-orange" size={28} />
    </div>
  ),
});

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["code-block"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike", "blockquote",
  "color", "background",
  "list", "bullet", "indent", "align",
  "link", "image", "video",
  "code-block",
];

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  content: string;
  isPublished: boolean;
  author: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  featuredImage: "",
  content: "",
  isPublished: false,
  author: "",
  category: "",
  tags: "",
  seoTitle: "",
  seoDescription: "",
};

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function wordCount(html: string) {
  return html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
}

function readingTime(html: string) {
  return Math.max(1, Math.ceil(wordCount(html) / 200));
}

// ────────────────────────────────────────────────────────────────────────
// Shared panel section wrapper
// ────────────────────────────────────────────────────────────────────────
function SideSection({
  title, icon, children, defaultOpen = true,
}: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wider">
          {icon} {title}
        </span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-gray-50">{children}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Field label helper
// ────────────────────────────────────────────────────────────────────────
function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{children}</label>
      {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Character counter bar for SEO fields
// ────────────────────────────────────────────────────────────────────────
function CharBar({ value, max, warn, label }: { value: string; max: number; warn: number; label: string }) {
  const len = value.length;
  const pct = Math.min(100, (len / max) * 100);
  const color = len > max ? "bg-red-500" : len > warn ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-[10px] mt-0.5 text-right font-mono ${len > max ? "text-red-500" : "text-gray-400"}`}>
        {len}/{max} {label}
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Main PostEditor component — shared by /new and /[id] pages
// ────────────────────────────────────────────────────────────────────────
interface PostEditorProps {
  /** undefined = new post, string = existing post ID */
  postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!postId;
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugLocked, setSlugLocked] = useState(isEditing);

  // Load existing post
  useEffect(() => {
    if (!isEditing) return;
    fetch(`/api/admin/blog/${postId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const p = d.data;
          setForm({
            title:          p.title         || "",
            slug:           p.slug          || "",
            excerpt:        p.excerpt        || "",
            featuredImage:  p.featuredImage  || "",
            content:        p.content        || "",
            isPublished:    p.isPublished    || false,
            author:         p.author         || "",
            category:       p.category       || "",
            tags:           p.tags           || "",
            seoTitle:       p.seoTitle       || "",
            seoDescription: p.seoDescription || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, isEditing]);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set("title", e.target.value);
    if (!slugLocked) set("slug", generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/blog/${postId}` : "/api/admin/blog";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        if (!isEditing) router.push(`/admin/blog/${data.data.id}`);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-brand-orange" size={36} />
          <p className="text-gray-500 font-medium">Loading post…</p>
        </div>
      </div>
    );
  }

  const wc   = wordCount(form.content);
  const rt   = readingTime(form.content);
  const siteUrl = "https://www.shop.nexuscalculator.net";

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">

      {/* ── TOP NAV BAR ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {isEditing ? "Editing Post" : "New Post"}
              </p>
              <p className="text-sm font-black text-gray-900 truncate max-w-[300px]">
                {form.title || "Untitled"}
              </p>
            </div>
          </div>

          {/* Right — stats + actions */}
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-400">
              <span>{wc.toLocaleString()} words</span>
              <span className="text-gray-200">|</span>
              <span>{rt} min read</span>
              {isEditing && form.slug && (
                <>
                  <span className="text-gray-200">|</span>
                  <a href={`${siteUrl}/blog/${form.slug}`} target="_blank" rel="noreferrer"
                    className="text-brand-orange hover:underline flex items-center gap-1">
                    Preview <ExternalLink size={10} />
                  </a>
                </>
              )}
            </div>

            {/* Status badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              form.isPublished
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}>
              {form.isPublished ? <Globe size={11} /> : <EyeOff size={11} />}
              {form.isPublished ? "Published" : "Draft"}
            </span>

            {/* Save button */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:bg-orange-300 transition-all shadow-lg shadow-orange-100"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saved ? (
                <CheckCircle size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving…" : saved ? "Saved!" : isEditing ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ══════════════════════════════════════
              LEFT — Main editor area (full-width feel)
              ══════════════════════════════════════ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <input
                ref={titleInputRef}
                required
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Your article headline…"
                className="w-full text-3xl md:text-4xl font-black text-gray-900 placeholder-gray-200 border-none outline-none resize-none leading-tight"
              />
              {/* Slug row */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Slug:</span>
                <span className="text-xs text-gray-400">{siteUrl}/blog/</span>
                <input
                  required
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugLocked(true);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="flex-1 text-xs font-mono text-brand-orange bg-orange-50 border border-orange-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="your-article-slug"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlugLocked(false);
                    set("slug", generateSlug(form.title));
                  }}
                  className="text-[10px] font-bold text-gray-400 hover:text-brand-orange transition-colors whitespace-nowrap"
                >
                  ↺ Auto
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Label hint="Shown on blog cards and used as meta description fallback">
                Article Excerpt
              </Label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Write a short, engaging summary (1–2 sentences)…"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange leading-relaxed"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <Label>Article Content</Label>
                <span className="text-xs font-mono text-gray-400">{wc} words · {rt} min read</span>
              </div>
              <div className="p-4">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(val) => set("content", val)}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Start writing your article here…"
                  className="prose-editor"
                  style={{ minHeight: "600px" }}
                />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════
              RIGHT — Sticky settings panel
              ══════════════════════════════════════ */}
          <div className="w-full xl:w-[340px] shrink-0 space-y-4 xl:sticky xl:top-24 xl:self-start">

            {/* ── Publish ── */}
            <SideSection title="Publish" icon={<Globe size={13} className="text-brand-orange" />}>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => set("isPublished", !form.isPublished)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                    form.isPublished
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {form.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    {form.isPublished ? "Live — Visible to readers" : "Draft — Not yet public"}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${form.isPublished ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                </button>
              </div>
            </SideSection>

            {/* ── Featured Image ── */}
            <SideSection title="Featured Image" icon={<ImageIcon size={13} className="text-brand-orange" />}>
              <input
                type="text"
                value={form.featuredImage}
                onChange={(e) => set("featuredImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              {form.featuredImage && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mt-1">
                  <Image
                    src={form.featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                </div>
              )}
            </SideSection>

            {/* ── Authoring ── */}
            <SideSection title="Authoring" icon={<User size={13} className="text-brand-orange" />}>
              <div>
                <Label hint="Display name shown on the article">Author</Label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. Abu Hanif"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <Label hint="Blog category for filtering and JSON-LD">Category</Label>
                <div className="relative">
                  <FolderOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="e.g. Technology"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>
              <div>
                <Label hint="Comma-separated — used as meta keywords & tag badges">Tags</Label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="seo, affiliate, hosting, tech"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                {/* Tag preview pills */}
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-orange bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        <Tag size={8} /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </SideSection>

            {/* ── SEO ── */}
            <SideSection title="SEO" icon={<Search size={13} className="text-brand-orange" />} defaultOpen={false}>

              {/* Google snippet preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Google Preview</p>
                <p className="text-blue-600 font-medium text-sm line-clamp-1">
                  {form.seoTitle || form.title || "Your Post Title"}
                </p>
                <p className="text-green-700 text-xs mt-0.5 truncate">
                  {siteUrl}/blog/{form.slug || "your-slug"}
                </p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {form.seoDescription || form.excerpt || "Your meta description will appear here. Aim for 150–160 characters."}
                </p>
              </div>

              <div>
                <Label hint="Overrides the page <title> tag for search engines">SEO Title</Label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder="Custom SEO title (optional)"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <CharBar value={form.seoTitle} max={60} warn={50} label="chars" />
              </div>
              <div>
                <Label hint="Overrides the meta description for search results">Meta Description</Label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  placeholder="Compelling description for search engine results…"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                />
                <CharBar value={form.seoDescription} max={160} warn={140} label="chars" />
              </div>
            </SideSection>

            {/* ── Excerpt mini-card ── */}
            <SideSection title="Summary" icon={<AlignLeft size={13} className="text-brand-orange" />} defaultOpen={false}>
              <p className="text-xs text-gray-500">Shown on blog listing cards if no excerpt is set above.</p>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Short summary (1–2 sentences)…"
                rows={4}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
              />
            </SideSection>

            {/* ── Bottom save ── */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white px-5 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:bg-orange-300 transition-all shadow-lg shadow-orange-100"
            >
              {saving ? <Loader2 size={17} className="animate-spin" /> : saved ? <CheckCircle size={17} /> : <Save size={17} />}
              {saving ? "Saving…" : saved ? "Saved!" : isEditing ? "Update Post" : "Create Post"}
            </button>

          </div>
        </div>
      </div>

      {/* ── Quill custom styles ── */}
      <style>{`
        .prose-editor .ql-container {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.8;
          border: none;
          min-height: 600px;
        }
        .prose-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
          border-radius: 12px 12px 0 0;
          padding: 10px 12px;
        }
        .prose-editor .ql-editor {
          min-height: 600px;
          padding: 24px 28px;
          color: #111827;
        }
        .prose-editor .ql-editor p { margin-bottom: 1rem; }
        .prose-editor .ql-editor h1 { font-size: 2rem; font-weight: 900; margin-bottom: 1rem; }
        .prose-editor .ql-editor h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.875rem; }
        .prose-editor .ql-editor h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; }
        .prose-editor .ql-editor blockquote {
          border-left: 4px solid #f97316;
          background: #fff7ed;
          padding: 1rem 1.5rem;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #374151;
          margin: 1.5rem 0;
        }
        .prose-editor .ql-editor pre {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          font-family: monospace;
          margin: 1.5rem 0;
        }
        .prose-editor .ql-editor img { border-radius: 12px; max-width: 100%; margin: 1rem auto; }
        .prose-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #d1d5db;
          font-size: 1rem;
        }
      `}</style>

    </form>
  );
}
