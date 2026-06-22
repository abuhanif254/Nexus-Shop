"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully.");
        router.refresh();
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {message && (
        <div className={`p-3 rounded text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 uppercase">Full Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 uppercase">Email Address</label>
        <input 
          type="email" 
          value={user.email} 
          disabled
          className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-3 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400">Email cannot be changed.</p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
