"use client";

import { useEffect } from "react";

/**
 * Fires a fire-and-forget POST to increment the view count for this post.
 * Renders nothing — invisible to the user.
 */
export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire once on mount, ignore any errors
    fetch(`/api/blog/${encodeURIComponent(slug)}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
