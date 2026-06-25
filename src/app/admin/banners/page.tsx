"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus, Trash2, ImageIcon, Edit2, X, Check,
  Eye, EyeOff, ChevronUp, ChevronDown, Sparkles, ExternalLink
} from "lucide-react";

// All supported banner positions
const POSITIONS = [
  { value: "home",        label: "🏠 Home — Hero Slider" },
  { value: "promo_strip", label: "🔥 Home — Promo Strip" },
  { value: "shop",        label: "🛍️ Shop Page — Top Banner" },
  { value: "category",    label: "📂 Category Page — Top Banner" },
  { value: "blog",        label: "📰 Blog Index — Sidebar" },
  { value: "blog_post",   label: "✍️ Blog Post — In-Article / Sidebar" },
  { value: "sidebar",     label: "📌 Site-Wide Sidebar" },
];

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  buttonText: "",
  image: "",
  link: "",
  position: "blog",
  order: "0",
  active: true,
};

type BannerForm = typeof EMPTY_FORM;

interface Banner extends Omit<BannerForm, "order"> {
  id: string;
  order: number;
  createdAt: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Panel state: 'add' shows the create form; 'edit' shows the edit modal
  const [panel, setPanel] = useState<"add" | "edit" | null>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>({ ...EMPTY_FORM });

  // Filter by position
  const [filterPosition, setFilterPosition] = useState<string>("all");

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setPanel("add");
  };

  const openEdit = (b: Banner) => {
    setForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      buttonText: b.buttonText || "",
      image: b.image,
      link: b.link,
      position: b.position,
      order: String(b.order),
      active: b.active,
    });
    setEditingId(b.id);
    setPanel("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...form, order: parseInt(form.order) || 0 };
    try {
      const url  = editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners';
      const method = editingId ? 'PUT' : 'POST';
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setPanel(null);
        setEditingId(null);
        await fetchBanners();
      } else {
        alert(data.error);
      }
    } catch { alert("Failed to save banner"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner? This cannot be undone.")) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    await fetchBanners();
  };

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/admin/banners/${b.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, active: !b.active }),
    });
    await fetchBanners();
  };

  const positionLabel = (val: string) =>
    POSITIONS.find(p => p.value === val)?.label ?? val;

  const filtered = filterPosition === "all"
    ? banners
    : banners.filter(b => b.position === filterPosition);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-brand-orange" /> Affiliate Banners
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage affiliate banners across all page positions. Each banner links to your affiliate URL.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="shrink-0 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-200"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Banners", value: banners.length },
          { label: "Active", value: banners.filter(b => b.active).length, color: "text-green-600" },
          { label: "Inactive", value: banners.filter(b => !b.active).length, color: "text-gray-400" },
          { label: "Positions Used", value: new Set(banners.map(b => b.position)).size },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color ?? "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Panel ── */}
      {panel && (
        <div className="bg-white rounded-2xl border-2 border-brand-orange/20 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              {panel === "add" ? <><Plus size={18} className="text-brand-orange" /> Add New Banner</> : <><Edit2 size={18} className="text-brand-orange" /> Edit Banner</>}
            </h2>
            <button onClick={() => setPanel(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Image URL + Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Banner Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  required type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://your-cdn.com/banner.jpg"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                {form.image && (
                  <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={form.image} alt="Preview" fill className="object-cover" onError={() => {}} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Affiliate Link (opens on click) <span className="text-red-500">*</span>
                </label>
                <input
                  required type="text"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://affiliate.example.com/?ref=nexus"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                {form.link && (
                  <a href={form.link} target="_blank" rel="noreferrer" className="mt-1.5 text-xs text-brand-orange hover:underline flex items-center gap-1">
                    <ExternalLink size={11} /> Test link
                  </a>
                )}
              </div>
            </div>

            {/* Row 2: Headline + Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Headline / Title
                  <span className="ml-1 text-gray-400 font-normal normal-case">(shown on banner)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder='e.g. "Get 40% Off Premium Hosting!"'
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Subtitle
                  <span className="ml-1 text-gray-400 font-normal normal-case">(optional tagline)</span>
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder='e.g. "Limited time offer for new customers"'
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Row 3: Button Text + Position + Order + Active */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Button Label
                  <span className="ml-1 text-gray-400 font-normal normal-case">(CTA text)</span>
                </label>
                <div className="relative">
                  <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange" />
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={e => setForm({ ...form, buttonText: e.target.value })}
                    placeholder='e.g. "Get This Deal →"'
                    className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                >
                  {POSITIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Display Order</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number" min="0"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Status</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-colors ${
                    form.active
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-300 bg-gray-50 text-gray-500"
                  }`}
                >
                  {form.active ? <><Eye size={15} /> Active</> : <><EyeOff size={15} /> Inactive</>}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setPanel(null)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-brand-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 disabled:bg-orange-300 flex items-center gap-2 transition-colors shadow-lg shadow-orange-100"
              >
                <Check size={16} />
                {isSubmitting ? "Saving…" : panel === "add" ? "Add Banner" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterPosition("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filterPosition === "all" ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All ({banners.length})
        </button>
        {POSITIONS.map(p => {
          const count = banners.filter(b => b.position === p.value).length;
          if (count === 0) return null;
          return (
            <button
              key={p.value}
              onClick={() => setFilterPosition(p.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filterPosition === p.value ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {p.label.split("—")[0].trim()} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Banners Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Content</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-center">Order</th>
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
                    <ImageIcon size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No banners found.</p>
                    <button onClick={openAdd} className="mt-3 text-brand-orange text-sm font-bold hover:underline">
                      + Add your first banner
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className={`hover:bg-gray-50/50 transition-colors ${!b.active ? "opacity-50" : ""}`}>

                    {/* Preview */}
                    <td className="p-4">
                      <a href={b.link} target="_blank" rel="noreferrer" title="Open affiliate link">
                        <div className="relative w-36 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                          <Image src={b.image} alt={b.title || "Banner"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                            <ExternalLink size={18} className="text-white" />
                          </div>
                        </div>
                      </a>
                    </td>

                    {/* Content */}
                    <td className="p-4 max-w-[260px]">
                      {b.title ? (
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{b.title}</p>
                      ) : (
                        <p className="text-gray-300 text-xs italic">No headline</p>
                      )}
                      {b.subtitle && (
                        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{b.subtitle}</p>
                      )}
                      {b.buttonText && (
                        <span className="mt-1.5 inline-flex items-center gap-1 bg-orange-50 text-brand-orange text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
                          <Sparkles size={9} /> {b.buttonText}
                        </span>
                      )}
                      <a href={b.link} target="_blank" rel="noreferrer" className="mt-1 text-[10px] text-gray-400 hover:text-brand-orange truncate block transition-colors">
                        {b.link}
                      </a>
                    </td>

                    {/* Position */}
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                        {positionLabel(b.position).replace(/^[^\w]*/, "").split("—")[0].trim()}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="p-4 text-center text-sm font-bold text-gray-500">
                      {b.order}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleActive(b)}
                        title={b.active ? "Click to deactivate" : "Click to activate"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          b.active
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        }`}
                      >
                        {b.active ? <Eye size={11} /> : <EyeOff size={11} />}
                        {b.active ? "Live" : "Off"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(b)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit banner"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete banner"
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
