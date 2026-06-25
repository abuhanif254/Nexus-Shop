"use client";

import { useState } from "react";
import { Link2, CheckCheck } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for old browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy link"
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
        copied
          ? "bg-green-500 text-white scale-110"
          : "bg-gray-100 text-gray-600 hover:bg-brand-dark hover:text-white"
      }`}
    >
      {copied ? <CheckCheck size={16} /> : <Link2 size={16} />}
    </button>
  );
}
