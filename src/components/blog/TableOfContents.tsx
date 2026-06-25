"use client";

import { useEffect, useState, useRef } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Auto-extracts h2 and h3 headings from the rendered article DOM,
 * builds a collapsible Table of Contents, and highlights the active
 * heading as the user scrolls.
 */
export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Wait for the prose content to paint
    const timer = setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll("article h2, article h3")
      ) as HTMLElement[];

      if (!headings.length) return;

      // Assign unique IDs to each heading so we can link to them
      const tocItems: TocItem[] = headings.map((el, i) => {
        const id = el.id || `toc-heading-${i}`;
        el.id = id;
        return {
          id,
          text: el.innerText,
          level: parseInt(el.tagName.replace("H", ""), 10),
        };
      });

      setItems(tocItems);

      // Intersection observer for active highlight
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(entry.target.id);
          });
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );

      headings.forEach((el) => observerRef.current?.observe(el));
    }, 400);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  if (items.length < 2) return null;

  return (
    <nav className="bg-orange-50/60 border border-orange-100 rounded-2xl overflow-hidden mb-8">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-black text-brand-orange uppercase tracking-widest">
          <List size={13} /> Table of Contents
        </span>
        <span className="text-brand-orange text-lg leading-none">{open ? "−" : "+"}</span>
      </button>

      {/* Items */}
      {open && (
        <ol className="px-5 pb-4 space-y-0.5 border-t border-orange-100">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) {
                    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
                    setActiveId(item.id);
                  }
                }}
                className={`block py-1.5 text-sm leading-snug transition-colors ${
                  activeId === item.id
                    ? "text-brand-orange font-black"
                    : "text-gray-600 hover:text-brand-orange font-medium"
                } ${item.level === 3 ? "text-[12px]" : ""}`}
              >
                {activeId === item.id && (
                  <span className="inline-block w-1.5 h-1.5 bg-brand-orange rounded-full mr-2 mb-0.5 align-middle" />
                )}
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
