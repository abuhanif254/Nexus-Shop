"use client";

import { useState } from "react";
import Link from "next/link";

interface CategoryPill {
  name: string;
  count: number;
}

export default function CategoryFilter({ categories, totalCount }: { categories: CategoryPill[]; totalCount: number }) {
  const [active, setActive] = useState("All");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All */}
      <Link
        href="/blog"
        onClick={() => setActive("All")}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
          active === "All"
            ? "bg-brand-dark text-white border-brand-dark shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange"
        }`}
      >
        All ({totalCount})
      </Link>
      {categories.map(cat => (
        <Link
          key={cat.name}
          href={`/blog?category=${encodeURIComponent(cat.name)}`}
          onClick={() => setActive(cat.name)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            active === cat.name
              ? "bg-brand-orange text-white border-brand-orange shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange"
          }`}
        >
          {cat.name} ({cat.count})
        </Link>
      ))}
    </div>
  );
}
